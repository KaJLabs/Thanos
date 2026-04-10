import type { TokenConfig } from '../types';

export interface MakaluTokenSeed {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  addressPreview: string;
  verified: boolean;
}

export interface MakaluLep100SourceConfig {
  chainId: number;
  rpcUrl: string;
  explorerBaseUrl: string;
  explorerTokensUrl: string;
  syncMode: 'rpc' | 'explorer' | 'hybrid';
  excludedSymbols: string[];
  tokens: MakaluTokenSeed[];
}

export const MAKALU_LEP100_SOURCE: MakaluLep100SourceConfig = {
  chainId: 700777,
  rpcUrl: 'https://rpc.litho.ai',
  explorerBaseUrl: 'https://makalu.litho.ai',
  explorerTokensUrl: 'https://makalu.litho.ai/tokens',
  syncMode: 'hybrid',
  excludedSymbols: ['LITBTC2'],
  tokens: [
    { symbol: 'wLITHO', name: 'Wrapped Lithosphere', decimals: 18, totalSupply: '1000000000', addressPreview: '0xEB6cfcC8...2a7Cfe', verified: true },
    { symbol: 'LAX', name: 'Lithosphere Algo', decimals: 18, totalSupply: '10000000000', addressPreview: '0x9611436e...5Eb3e8', verified: true },
    { symbol: 'JOT', name: 'Jot Art', decimals: 18, totalSupply: '1000000000', addressPreview: '0x8187b232...AAf2e2', verified: true },
    { symbol: 'COLLE', name: 'Colle AI', decimals: 18, totalSupply: '5000000000', addressPreview: '0xE7eBf52b...60DF49', verified: true },
    { symbol: 'IMAGE', name: 'Imagen Network', decimals: 18, totalSupply: '10000000000', addressPreview: '0x7a29252B...15c844', verified: true },
    { symbol: 'AGII', name: 'AGII', decimals: 18, totalSupply: '1000000000', addressPreview: '0x9984ad7a...6Fe020', verified: true },
    { symbol: 'BLDR', name: 'Built AI', decimals: 18, totalSupply: '1000000000', addressPreview: '0x07039884...85A26F', verified: true },
    { symbol: 'FGPT', name: 'FurGPT', decimals: 18, totalSupply: '1000000000', addressPreview: '0xa25c2a49...1d592F', verified: true },
    { symbol: 'MUSA', name: 'Mansa AI', decimals: 18, totalSupply: '1000000000', addressPreview: '0xDEE12eD9...A97EFa', verified: true }
  ]
};

export function getMakaluExplorerAddressPreview(symbol: string): string | undefined {
  return MAKALU_LEP100_SOURCE.tokens.find((token) => token.symbol.toUpperCase() === symbol.toUpperCase())?.addressPreview;
}

export function makeMakaluTokenConfig(seed: MakaluTokenSeed): TokenConfig {
  return {
    symbol: seed.symbol,
    name: seed.name,
    decimals: seed.decimals,
    standard: 'lep100',
    chainIds: [MAKALU_LEP100_SOURCE.chainId],
    addresses: {},
    verified: seed.verified,
    lep100: {
      module: 'LEP100',
      version: 'v1',
      assetId: `makalu-${seed.symbol.toLowerCase()}`,
      verifiedSource: 'registry',
      sourceChain: 'makalu',
      syncMode: MAKALU_LEP100_SOURCE.syncMode,
      explorerAddressPreview: seed.addressPreview,
      contractAddressStatus: 'preview-only'
    }
  };
}
