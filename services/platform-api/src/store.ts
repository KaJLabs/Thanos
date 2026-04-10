import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type UserRecord = { id: string; email: string; passwordHash: string; displayName?: string; createdAt: string };
export type SessionRecord = { id: string; userId: string; createdAt: string };
export type ContactRecord = { id: string; userId: string; label: string; address: string; chainId?: number; notes?: string; createdAt: string };
export type DraftRecord = { id: string; userId: string; from: string; to: string; amount: string; chainId: number; assetSymbol: string; memo?: string; createdAt: string };
export type DatabaseShape = { users: UserRecord[]; sessions: SessionRecord[]; contacts: ContactRecord[]; drafts: DraftRecord[] };

const DB_PATH = path.join(process.cwd(), '.platform-api-db.json');
const emptyDb = (): DatabaseShape => ({ users: [], sessions: [], contacts: [], drafts: [] });

export function loadDb(): DatabaseShape {
  if (!fs.existsSync(DB_PATH)) return emptyDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as DatabaseShape;
}

export function saveDb(db: DatabaseShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export const ids = { next: () => crypto.randomUUID() };
export const password = {
  hash(value: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(value, salt, 100000, 32, 'sha256').toString('hex');
    return `${salt}:${hash}`;
  },
  verify(value: string, encoded: string) {
    const [salt, expected] = encoded.split(':');
    const actual = crypto.pbkdf2Sync(value, salt, 100000, 32, 'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  }
};
