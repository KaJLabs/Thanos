import { HDNodeWallet, Mnemonic, Wallet } from 'ethers';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export function createMnemonic(): string {
  return Wallet.createRandom().mnemonic!.phrase;
}

export function walletFromMnemonic(mnemonic: string, accountIndex = 0): HDNodeWallet {
  const phrase = Mnemonic.fromPhrase(mnemonic).phrase;
  return HDNodeWallet.fromPhrase(phrase, undefined, `m/44'/60'/0'/0/${accountIndex}`);
}

export function deriveSolanaKeypair(mnemonic: string, accountIndex = 0) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derived = derivePath(`m/44'/501'/${accountIndex}'/0'`, seed.toString('hex')).key;
  const keypair = nacl.sign.keyPair.fromSeed(derived);
  return {
    publicKey: bs58.encode(Buffer.from(keypair.publicKey)),
    secretKey: Buffer.from(keypair.secretKey),
    derivationPath: `m/44'/501'/${accountIndex}'/0'`
  };
}
