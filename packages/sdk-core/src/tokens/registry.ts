import type { TokenConfig } from '../types';
import {
  BITCOIN_MAINNET,
  BITCOIN_TESTNET,
  MAKALU_TESTNET,
  KAMET_TESTNET,
  SOLANA_MAINNET,
  SOLANA_DEVNET,
  ETHEREUM,
  BSC
} from '../chains/networks';
import { getMakaluLep100Tokens } from './lep100-registry';

export const DEFAULT_TOKENS: TokenConfig[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    standard: 'btc',
    chainIds: [BITCOIN_MAINNET.chainId, BITCOIN_TESTNET.chainId],
    addresses: {}
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    standard: 'native',
    chainIds: [SOLANA_MAINNET.chainId, SOLANA_DEVNET.chainId],
    addresses: {}
  },
  {
    symbol: 'USDC-SPL',
    name: 'USD Coin (SPL)',
    decimals: 6,
    standard: 'spl',
    chainIds: [SOLANA_MAINNET.chainId, SOLANA_DEVNET.chainId],
    addresses: {
      [SOLANA_MAINNET.chainId]: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      [SOLANA_DEVNET.chainId]: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    }
  },
  {
    symbol: 'LITHO',
    name: 'Lithosphere',
    decimals: 18,
    standard: 'native',
    chainIds: [MAKALU_TESTNET.chainId, KAMET_TESTNET.chainId],
    addresses: {}
  },
  {
    symbol: 'COLLE',
    name: 'Colle AI',
    decimals: 18,
    standard: 'erc20',
    chainIds: [ETHEREUM.chainId, BSC.chainId, MAKALU_TESTNET.chainId, KAMET_TESTNET.chainId],
    addresses: {
      [ETHEREUM.chainId]: '0x0000000000000000000000000000000000000000',
      [BSC.chainId]: '0x0000000000000000000000000000000000000000',
      [MAKALU_TESTNET.chainId]: '0x0000000000000000000000000000000000000001',
      [KAMET_TESTNET.chainId]: '0x0000000000000000000000000000000000000001'
    },
    externalUrl: 'https://coinmarketcap.com/currencies/colle-ai/'
  },
  {
    symbol: 'AGII',
    name: 'AGII',
    decimals: 18,
    standard: 'erc20',
    chainIds: [ETHEREUM.chainId, BSC.chainId, MAKALU_TESTNET.chainId, KAMET_TESTNET.chainId],
    addresses: {
      [ETHEREUM.chainId]: '0x0000000000000000000000000000000000000002',
      [BSC.chainId]: '0x0000000000000000000000000000000000000002',
      [MAKALU_TESTNET.chainId]: '0x0000000000000000000000000000000000000002',
      [KAMET_TESTNET.chainId]: '0x0000000000000000000000000000000000000002'
    },
    externalUrl: 'https://coinmarketcap.com/currencies/agii/'
  },
  {
    symbol: 'ATUA',
    name: 'Atua AI',
    decimals: 18,
    standard: 'erc20',
    chainIds: [ETHEREUM.chainId, BSC.chainId, MAKALU_TESTNET.chainId, KAMET_TESTNET.chainId],
    addresses: {
      [ETHEREUM.chainId]: '0x0000000000000000000000000000000000000003',
      [BSC.chainId]: '0x0000000000000000000000000000000000000003',
      [MAKALU_TESTNET.chainId]: '0x0000000000000000000000000000000000000003',
      [KAMET_TESTNET.chainId]: '0x0000000000000000000000000000000000000003'
    },
    externalUrl: 'https://coinmarketcap.com/currencies/atua-ai/'
  },
  {
    symbol: 'IMAGEN',
    name: 'Imagen Network',
    decimals: 18,
    standard: 'erc20',
    chainIds: [ETHEREUM.chainId, BSC.chainId, MAKALU_TESTNET.chainId, KAMET_TESTNET.chainId],
    addresses: {
      [ETHEREUM.chainId]: '0x0000000000000000000000000000000000000004',
      [BSC.chainId]: '0x0000000000000000000000000000000000000004',
      [MAKALU_TESTNET.chainId]: '0x0000000000000000000000000000000000000004',
      [KAMET_TESTNET.chainId]: '0x0000000000000000000000000000000000000004'
    },
    externalUrl: 'https://coinmarketcap.com/currencies/imagen-network/'
  }
,
  ...getMakaluLep100Tokens()
];

export function getDefaultTokensForChain(chainId: number): TokenConfig[] {
  return DEFAULT_TOKENS.filter((token) => token.chainIds.includes(chainId));
}

export function getVerifiedLep100Tokens(chainId: number): TokenConfig[] {
  return DEFAULT_TOKENS.filter((token) => token.standard === 'lep100' && token.chainIds.includes(chainId));
}
