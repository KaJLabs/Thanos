import type { TokenConfig, TokenImportRequest } from '../types';
import { getDefaultTokensForChain } from '../tokens/registry';

export class TokenImporter {
  async importToken(request: TokenImportRequest): Promise<TokenConfig> {
    const existing = getDefaultTokensForChain(request.chainId).find((token) => token.addresses[request.chainId] === request.address);
    if (existing) return existing;
    const standard = request.standard || inferStandard(request.address);
    return {
      symbol: request.symbol || inferSymbol(standard),
      name: request.name || 'Imported Token',
      decimals: request.decimals ?? 18,
      standard,
      chainIds: [request.chainId],
      addresses: { [request.chainId]: request.address },
      verified: false,
      lep100: standard === 'lep100' ? { module: 'LEP100', version: 'v1', verifiedSource: 'imported' } : undefined
    };
  }
}

function inferStandard(address: string): TokenConfig['standard'] {
  if (address.startsWith('lep100:')) return 'lep100';
  if (address.length === 42 && address.startsWith('0x')) return 'erc20';
  if (address.length > 30) return 'spl';
  return 'native';
}

function inferSymbol(standard: TokenConfig['standard']) {
  switch (standard) {
    case 'lep100': return 'LEP';
    case 'spl': return 'SPL';
    case 'erc20': return 'ERC';
    default: return 'TOK';
  }
}
