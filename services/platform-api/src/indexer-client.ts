const INDEXER_BASE_URL = process.env.INDEXER_BASE_URL || 'http://localhost:4010';

export async function indexerGet<T>(path: string): Promise<T> {
  const res = await fetch(`${INDEXER_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Indexer error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function indexerPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${INDEXER_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`Indexer error ${res.status}`);
  return res.json() as Promise<T>;
}
