import type {
  Lep100ActivityItem,
  Lep100ApprovalRecord,
  Lep100SyncJob,
  Lep100TokenListResponse,
  PortfolioSnapshot
} from '../types';

export class IndexerClient {
  constructor(private readonly baseUrl = 'http://localhost:4010') {}

  private async json<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
      ...init
    });
    if (!response.ok) throw new Error(`Indexer request failed: ${response.status}`);
    return response.json();
  }

  async getPortfolio(walletAddress: string): Promise<PortfolioSnapshot> {
    return this.json(`/portfolio/${walletAddress}`);
  }

  async getActivity(walletAddress: string) {
    return this.json(`/activity/${walletAddress}`);
  }

  async getLep100Tokens(chainId: number): Promise<Lep100TokenListResponse> {
    return this.json(`/lep100/tokens?chainId=${chainId}`);
  }

  async getLep100Activity(walletAddress: string): Promise<{ walletAddress: string; items: Lep100ActivityItem[] }> {
    return this.json(`/lep100/activity/${walletAddress}`);
  }

  async getLep100Approvals(walletAddress: string): Promise<{ walletAddress: string; items: Lep100ApprovalRecord[] }> {
    return this.json(`/lep100/approvals/${walletAddress}`);
  }

  async queueLep100Sync(chainId: number, mode: Lep100SyncJob['mode'] = 'incremental'): Promise<{ job: Lep100SyncJob }> {
    return this.json('/lep100/sync', {
      method: 'POST',
      body: JSON.stringify({ chainId, mode })
    });
  }
}
