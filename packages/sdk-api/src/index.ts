export type AuthLoginRequest = { email: string; password: string };
export type AuthRegisterRequest = { email: string; password: string; displayName?: string };
export type AuthSession = { accessToken: string; refreshToken?: string; user: { id: string; email: string; displayName?: string } };
export type ContactRecord = { id: string; label: string; address: string; chainId?: number; notes?: string; createdAt?: string };
export type TxDraft = { id: string; from: string; to: string; amount: string; chainId: number; assetSymbol: string; memo?: string; createdAt?: string };

export interface ApiClientOptions {
  baseUrl: string;
  accessToken?: string;
  fetchImpl?: typeof fetch;
}

export class PlatformApiClient {
  private readonly baseUrl: string;
  private accessToken?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.accessToken = options.accessToken;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  setAccessToken(token?: string) {
    this.accessToken = token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(this.accessToken ? { authorization: `Bearer ${this.accessToken}` } : {}),
        ...(init?.headers || {})
      }
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API ${response.status}: ${text}`);
    }
    return response.json() as Promise<T>;
  }

  health() { return this.request<{ ok: boolean; service: string; version: string }>('/health'); }
  register(body: AuthRegisterRequest) { return this.request<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify(body) }); }
  login(body: AuthLoginRequest) { return this.request<AuthSession>('/auth/login', { method: 'POST', body: JSON.stringify(body) }); }
  me() { return this.request<{ user: AuthSession['user'] }>('/auth/me'); }
  listContacts() { return this.request<{ items: ContactRecord[] }>('/contacts'); }
  createContact(body: Omit<ContactRecord, 'id' | 'createdAt'>) { return this.request<ContactRecord>('/contacts', { method: 'POST', body: JSON.stringify(body) }); }
  listDrafts() { return this.request<{ items: TxDraft[] }>('/wallets/drafts'); }
  createDraft(body: Omit<TxDraft, 'id' | 'createdAt'>) { return this.request<TxDraft>('/wallets/drafts', { method: 'POST', body: JSON.stringify(body) }); }
  portfolio(address: string) { return this.request(`/portfolio/${encodeURIComponent(address)}`); }
  activity(address: string) { return this.request(`/activity/${encodeURIComponent(address)}`); }
  dnnsResolve(name: string) { return this.request(`/dnns/resolve/${encodeURIComponent(name)}`); }
  lep100Tokens(chainId = 700777) { return this.request(`/lep100/tokens?chainId=${chainId}`); }
  lep100Balances(address: string) { return this.request(`/lep100/balances/${encodeURIComponent(address)}`); }
  lep100Activity(address: string) { return this.request(`/lep100/activity/${encodeURIComponent(address)}`); }
  lep100Sync(mode: 'bootstrap' | 'incremental' | 'backfill' = 'incremental') { return this.request('/lep100/sync', { method: 'POST', body: JSON.stringify({ mode }) }); }
}
