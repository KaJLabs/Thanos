import type { SecureStore } from './memory-store';
import { decryptString, encryptString } from '../utils/crypto';

export class BrowserSecureStore implements SecureStore {
  constructor(private readonly namespace = 'thanos', private readonly secret = 'thanos-browser-secret') {}

  private key(key: string) {
    return `${this.namespace}:${key}`;
  }

  async get(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const encrypted = window.localStorage.getItem(this.key(key));
    if (!encrypted) return null;
    return decryptString(this.secret, encrypted);
  }

  async set(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const encrypted = await encryptString(this.secret, value);
    window.localStorage.setItem(this.key(key), encrypted);
  }

  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(this.key(key));
  }
}
