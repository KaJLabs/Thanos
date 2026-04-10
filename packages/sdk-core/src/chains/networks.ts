import type { NetworkConfig } from '../types';

export const MAKALU_TESTNET: NetworkConfig = {
  id: 'lithosphere-makalu',
  chainId: 700777,
  name: 'Lithosphere Makalu',
  kind: 'lithic',
  rpcUrls: ['https://rpc.litho.ai'],
  blockExplorerUrl: 'https://explorer.litho.ai',
  nativeCurrency: { name: 'Lithosphere', symbol: 'LITHO', decimals: 18 }
};

export const KAMET_TESTNET: NetworkConfig = {
  id: 'lithosphere-kamet',
  chainId: 700778,
  name: 'Lithosphere Kamet',
  kind: 'lithic',
  rpcUrls: ['https://rpc.kamet.litho.ai'],
  blockExplorerUrl: 'https://kamet.litho.ai',
  nativeCurrency: { name: 'Lithosphere', symbol: 'LITHO', decimals: 18 }
};

export const ETHEREUM: NetworkConfig = {
  id: 'ethereum',
  chainId: 1,
  name: 'Ethereum',
  kind: 'evm',
  rpcUrls: ['https://eth.llamarpc.com'],
  blockExplorerUrl: 'https://etherscan.io',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
};

export const BSC: NetworkConfig = {
  id: 'bsc',
  chainId: 56,
  name: 'BNB Smart Chain',
  kind: 'evm',
  rpcUrls: ['https://bsc-dataseed.binance.org'],
  blockExplorerUrl: 'https://bscscan.com',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
};

export const BITCOIN_MAINNET: NetworkConfig = {
  id: 'bitcoin-mainnet',
  chainId: 1000000,
  name: 'Bitcoin',
  kind: 'bitcoin',
  rpcUrls: ['https://mempool.space/api'],
  blockExplorerUrl: 'https://mempool.space',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 8 }
};

export const BITCOIN_TESTNET: NetworkConfig = {
  id: 'bitcoin-testnet',
  chainId: 1000001,
  name: 'Bitcoin Testnet',
  kind: 'bitcoin',
  rpcUrls: ['https://mempool.space/testnet/api'],
  blockExplorerUrl: 'https://mempool.space/testnet',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 8 }
};

export const SOLANA_MAINNET: NetworkConfig = {
  id: 'solana-mainnet',
  chainId: 900,
  name: 'Solana',
  kind: 'solana',
  rpcUrls: ['https://api.mainnet-beta.solana.com'],
  blockExplorerUrl: 'https://explorer.solana.com',
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 }
};

export const SOLANA_DEVNET: NetworkConfig = {
  id: 'solana-devnet',
  chainId: 901,
  name: 'Solana Devnet',
  kind: 'solana',
  rpcUrls: ['https://api.devnet.solana.com'],
  blockExplorerUrl: 'https://explorer.solana.com/?cluster=devnet',
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 }
};

export const SUPPORTED_NETWORKS = [
  MAKALU_TESTNET,
  KAMET_TESTNET,
  ETHEREUM,
  BSC,
  BITCOIN_MAINNET,
  BITCOIN_TESTNET,
  SOLANA_MAINNET,
  SOLANA_DEVNET
];

export function getNetworkByChainId(chainId: number): NetworkConfig {
  const network = SUPPORTED_NETWORKS.find((item) => item.chainId === chainId);
  if (!network) throw new Error(`Unsupported chainId: ${chainId}`);
  return network;
}
