import { Lep100Client } from '../../../packages/sdk-core/src/clients/lep100-client';
import { MAKALU_LEP100_SOURCE } from '../../../packages/sdk-core/src/tokens/makalu-lep100-source';
import type {
  Lep100ActivityItem,
  Lep100ApprovalRecord,
  Lep100SyncJob,
  Lep100TokenListResponse
} from '../../../packages/sdk-core/src/types';

const now = () => new Date().toISOString();

export interface ResolvedMakaluToken {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  contractAddress?: string;
  addressPreview: string;
  contractAddressStatus: 'verified' | 'preview-only' | 'unresolved';
  verified: boolean;
}

const env = (name: string) => (typeof process !== 'undefined' ? process.env[name] : undefined);

function resolveFullAddressFromEnv(symbol: string): string | undefined {
  const key = `MAKALU_LEP100_${symbol.toUpperCase()}_ADDRESS`;
  return env(key);
}

export function getResolvedMakaluTokens(): ResolvedMakaluToken[] {
  return MAKALU_LEP100_SOURCE.tokens
    .filter((token) => !MAKALU_LEP100_SOURCE.excludedSymbols.includes(token.symbol.toUpperCase()))
    .map((token) => {
      const full = resolveFullAddressFromEnv(token.symbol);
      return {
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        totalSupply: token.totalSupply,
        contractAddress: full,
        addressPreview: token.addressPreview,
        contractAddressStatus: full ? 'verified' : 'preview-only',
        verified: token.verified
      };
    });
}

export async function fetchMakaluTokenMetadataFromRpc() {
  const client = new Lep100Client();
  const tokens = getResolvedMakaluTokens();
  const resolved = tokens.filter((token) => token.contractAddress);

  const items = await Promise.all(
    resolved.map(async (token) => {
      try {
        const metadata = await client.getMetadata(MAKALU_LEP100_SOURCE.chainId, token.contractAddress!);
        return {
          ...token,
          ...metadata,
          contractAddressStatus: 'verified' as const
        };
      } catch {
        return {
          ...token,
          contractAddressStatus: 'unresolved' as const
        };
      }
    })
  );

  return items;
}

export function getMakaluSeedTokenList(): Lep100TokenListResponse {
  return {
    chainId: MAKALU_LEP100_SOURCE.chainId,
    items: getResolvedMakaluTokens().map((token) => ({
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      standard: 'lep100',
      chainIds: [MAKALU_LEP100_SOURCE.chainId],
      addresses: token.contractAddress ? { [MAKALU_LEP100_SOURCE.chainId]: token.contractAddress } : {},
      contractAddress: token.contractAddress,
      holders: 0,
      verified: token.verified,
      lep100: {
        module: 'LEP100',
        version: 'v1',
        assetId: `makalu-${token.symbol.toLowerCase()}`,
        verifiedSource: 'registry',
        sourceChain: 'makalu',
        syncMode: MAKALU_LEP100_SOURCE.syncMode,
        explorerAddressPreview: token.addressPreview,
        contractAddressStatus: token.contractAddressStatus
      }
    }))
  };
}

export const seededApprovals: Lep100ApprovalRecord[] = [
  {
    chainId: MAKALU_LEP100_SOURCE.chainId,
    contractAddress: env('MAKALU_LEP100_COLLE_ADDRESS') || 'preview:0xE7eBf52b...60DF49',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    spender: 'litho1ignitepool000000000000000000000000000',
    amount: '1000',
    symbol: 'COLLE',
    updatedAt: now()
  },
  {
    chainId: MAKALU_LEP100_SOURCE.chainId,
    contractAddress: env('MAKALU_LEP100_AGII_ADDRESS') || 'preview:0x9984ad7a...6Fe020',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    spender: 'litho1multxrouter00000000000000000000000000',
    amount: '500',
    symbol: 'AGII',
    updatedAt: now()
  }
];

export function queueMakaluSync(mode: Lep100SyncJob['mode']): Lep100SyncJob {
  const tokens = getResolvedMakaluTokens();
  return {
    id: `lep100-sync-${Date.now()}`,
    chainId: MAKALU_LEP100_SOURCE.chainId,
    mode,
    status: 'queued',
    cursor: 'block:0',
    tokensDiscovered: tokens.length,
    eventsIndexed: 0,
    startedAt: now(),
    updatedAt: now()
  };
}

export async function runMakaluSync(mode: Lep100SyncJob['mode']) {
  const job = queueMakaluSync(mode);
  const rpcMetadata = await fetchMakaluTokenMetadataFromRpc().catch(() => []);
  const seeded = getMakaluSeedTokenList();

  return {
    job: { ...job, status: 'completed', updatedAt: now(), eventsIndexed: 0 },
    source: {
      chainId: MAKALU_LEP100_SOURCE.chainId,
      rpcUrl: MAKALU_LEP100_SOURCE.rpcUrl,
      explorerTokensUrl: MAKALU_LEP100_SOURCE.explorerTokensUrl,
      syncMode: MAKALU_LEP100_SOURCE.syncMode
    },
    tokens: seeded.items.map((token) => {
      const live = rpcMetadata.find((item) => item.symbol === token.symbol);
      return live
        ? {
            ...token,
            contractAddress: live.contractAddress,
            addresses: live.contractAddress ? { [MAKALU_LEP100_SOURCE.chainId]: live.contractAddress } : token.addresses,
            decimals: live.decimals ?? token.decimals,
            name: live.name ?? token.name,
            lep100: {
              ...token.lep100,
              contractAddressStatus: live.contractAddressStatus
            }
          }
        : token;
    })
  };
}

export function buildExplorerTokenLink(addressOrPreview: string) {
  return addressOrPreview.startsWith('0x')
    ? `${MAKALU_LEP100_SOURCE.explorerBaseUrl}/token/${addressOrPreview}`
    : MAKALU_LEP100_SOURCE.explorerTokensUrl;
}

export function buildSeedActivity(walletAddress: string): Lep100ActivityItem[] {
  return [
    {
      id: 'lep100-1',
      chainId: MAKALU_LEP100_SOURCE.chainId,
      contractAddress: env('MAKALU_LEP100_COLLE_ADDRESS') || 'preview:0xE7eBf52b...60DF49',
      symbol: 'COLLE',
      kind: 'transfer',
      direction: 'in',
      amount: '1500',
      counterparty: walletAddress,
      txHash: '0xlep100colle',
      status: 'confirmed',
      createdAt: now()
    },
    {
      id: 'lep100-2',
      chainId: MAKALU_LEP100_SOURCE.chainId,
      contractAddress: env('MAKALU_LEP100_AGII_ADDRESS') || 'preview:0x9984ad7a...6Fe020',
      symbol: 'AGII',
      kind: 'approval',
      spender: 'litho1multxrouter00000000000000000000000000',
      amount: '500',
      txHash: '0xlep100agii',
      status: 'pending',
      createdAt: now()
    }
  ];
}
