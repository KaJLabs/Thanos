const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function deriveAesKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', textEncoder.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(input: string): Uint8Array {
  return Uint8Array.from(atob(input), (char) => char.charCodeAt(0));
}

export async function encryptString(secret: string, plaintext: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(secret, salt);
  const cipherText = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, textEncoder.encode(plaintext));
  return JSON.stringify({
    salt: toBase64(salt),
    iv: toBase64(iv),
    payload: toBase64(new Uint8Array(cipherText))
  });
}

export async function decryptString(secret: string, payload: string): Promise<string> {
  const parsed = JSON.parse(payload) as { salt: string; iv: string; payload: string };
  const key = await deriveAesKey(secret, fromBase64(parsed.salt));
  const bytes = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(parsed.iv) },
    key,
    fromBase64(parsed.payload)
  );
  return textDecoder.decode(bytes);
}
