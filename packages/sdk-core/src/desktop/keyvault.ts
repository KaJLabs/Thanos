import type { SecureStore } from '../storage/memory-store';

export interface DesktopVaultAdapter {
  getPassword(service: string, account: string): Promise<string | null>;
  setPassword(service: string, account: string, password: string): Promise<void>;
  deletePassword(service: string, account: string): Promise<boolean>;
}

export class DesktopVaultStore implements SecureStore {
  constructor(private readonly adapter: DesktopVaultAdapter, private readonly namespace = 'thanos-desktop') {}

  async get(key: string): Promise<string | null> {
    return this.adapter.getPassword(this.namespace, key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.adapter.setPassword(this.namespace, key, value);
  }

  async remove(key: string): Promise<void> {
    await this.adapter.deletePassword(this.namespace, key);
  }
}
