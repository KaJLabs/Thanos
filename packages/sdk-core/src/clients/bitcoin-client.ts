import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import type { BitcoinSendRequest } from '../types';
import { BITCOIN_MAINNET, BITCOIN_TESTNET } from '../chains/networks';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

export interface BitcoinTransport {
  getFeeRate(): Promise<number>;
  listUnspents(address: string): Promise<Array<{ txid: string; vout: number; value: number; rawTxHex?: string }>>;
  broadcast(rawTxHex: string): Promise<string>;
}

export class MempoolBitcoinTransport implements BitcoinTransport {
  constructor(private readonly baseUrl: string) {}

  async getFeeRate(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/v1/fees/recommended`);
    const json = await response.json();
    return json.fastestFee ?? 15;
  }

  async listUnspents(address: string) {
    const response = await fetch(`${this.baseUrl}/address/${address}/utxo`);
    return response.json();
  }

  async broadcast(rawTxHex: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/tx`, { method: 'POST', body: rawTxHex });
    return response.text();
  }
}

export class BitcoinClient {
  constructor(private readonly transportFactory?: (networkId: 'bitcoin-mainnet' | 'bitcoin-testnet') => BitcoinTransport) {}

  private networkConfig(networkId: 'bitcoin-mainnet' | 'bitcoin-testnet') {
    return networkId === 'bitcoin-mainnet'
      ? { network: bitcoin.networks.bitcoin, rpcUrl: BITCOIN_MAINNET.rpcUrls[0] }
      : { network: bitcoin.networks.testnet, rpcUrl: BITCOIN_TESTNET.rpcUrls[0] };
  }

  private transport(networkId: 'bitcoin-mainnet' | 'bitcoin-testnet') {
    if (this.transportFactory) return this.transportFactory(networkId);
    return new MempoolBitcoinTransport(this.networkConfig(networkId).rpcUrl);
  }

  deriveAccount(mnemonic: string, accountIndex = 0, networkId: 'bitcoin-mainnet' | 'bitcoin-testnet' = 'bitcoin-mainnet') {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, this.networkConfig(networkId).network);
    const child = root.derivePath(`m/84'/0'/0'/0/${accountIndex}`);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(child.publicKey),
      network: this.networkConfig(networkId).network
    });
    return {
      address: address || '',
      publicKey: Buffer.from(child.publicKey).toString('hex'),
      derivationPath: `m/84'/0'/0'/0/${accountIndex}`
    };
  }

  async send(mnemonic: string, request: BitcoinSendRequest): Promise<string> {
    const config = this.networkConfig(request.networkId);
    const transport = this.transport(request.networkId);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, config.network);
    const child = root.derivePath(`m/84'/0'/0'/0/0`);
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey!));
    const { address } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(child.publicKey), network: config.network });
    if (!address) throw new Error('Unable to derive bitcoin address');

    const utxos = await transport.listUnspents(address);
    const feeRate = request.feeRateSatPerVb ?? (await transport.getFeeRate());
    const psbt = new bitcoin.Psbt({ network: config.network });
    let total = 0;

    for (const utxo of utxos) {
      total += utxo.value;
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: bitcoin.payments.p2wpkh({ pubkey: Buffer.from(child.publicKey), network: config.network }).output!,
          value: utxo.value
        }
      });
      if (total >= request.amountSats + 1000) break;
    }

    const estimatedVbytes = 10 + utxos.length * 68 + 2 * 31;
    const fee = estimatedVbytes * feeRate;
    const change = total - request.amountSats - fee;
    if (change < 0) throw new Error('Insufficient BTC balance');

    psbt.addOutput({ address: request.to, value: request.amountSats });
    if (change > 546) psbt.addOutput({ address, value: change });

    psbt.signAllInputs(keyPair);
    psbt.finalizeAllInputs();
    return transport.broadcast(psbt.extractTransaction().toHex());
  }
}
