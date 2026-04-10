import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import type { SolanaSendRequest } from '../types';
import { getNetworkByChainId } from '../chains/networks';
import { deriveSolanaKeypair } from '../utils/mnemonic';

export class SolanaClient {
  getConnection(chainId: number): Connection {
    const network = getNetworkByChainId(chainId);
    return new Connection(network.rpcUrls[0], 'confirmed');
  }

  deriveAccount(mnemonic: string, accountIndex = 0) {
    const derived = deriveSolanaKeypair(mnemonic, accountIndex);
    return {
      address: derived.publicKey,
      publicKey: derived.publicKey,
      secretKey: derived.secretKey,
      derivationPath: derived.derivationPath
    };
  }

  async send(mnemonic: string, request: SolanaSendRequest): Promise<string> {
    const connection = this.getConnection(request.chainId);
    const derived = deriveSolanaKeypair(mnemonic, 0);
    const signer = Keypair.fromSecretKey(derived.secretKey);

    if (!request.mintAddress) {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: signer.publicKey,
          toPubkey: new PublicKey(request.to),
          lamports: Math.round(Number(request.amount) * LAMPORTS_PER_SOL)
        })
      );
      return connection.sendTransaction(transaction, [signer]);
    }

    const mint = new PublicKey(request.mintAddress);
    const decimals = request.decimals ?? 6;
    const fromAta = getAssociatedTokenAddressSync(mint, signer.publicKey);
    const toOwner = new PublicKey(request.to);
    const toAta = getAssociatedTokenAddressSync(mint, toOwner, true);
    const accountInfo = await connection.getAccountInfo(toAta);
    const amount = BigInt(Math.round(Number(request.amount) * 10 ** decimals));
    const transaction = new Transaction();

    if (!accountInfo) {
      transaction.add(createAssociatedTokenAccountInstruction(signer.publicKey, toAta, toOwner, mint));
    }

    transaction.add(createTransferInstruction(fromAta, toAta, signer.publicKey, amount, [], TOKEN_PROGRAM_ID));
    return connection.sendTransaction(transaction, [signer]);
  }

  signMessage(mnemonic: string, message: Uint8Array): string {
    const derived = deriveSolanaKeypair(mnemonic, 0);
    return bs58.encode(nacl.sign.detached(message, derived.secretKey));
  }
}
