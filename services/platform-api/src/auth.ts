import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ids, loadDb, password, saveDb } from './store';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
}

export function issueSession(userId: string) {
  const db = loadDb();
  const session = { id: ids.next(), userId, createdAt: new Date().toISOString() };
  db.sessions.push(session);
  saveDb(db);
  return { accessToken: signToken(userId), refreshToken: session.id };
}

export function register(email: string, rawPassword: string, displayName?: string) {
  const db = loadDb();
  if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email already registered');
  const user = { id: ids.next(), email, passwordHash: password.hash(rawPassword), displayName, createdAt: new Date().toISOString() };
  db.users.push(user);
  saveDb(db);
  return user;
}

export function login(email: string, rawPassword: string) {
  const db = loadDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !password.verify(rawPassword, user.passwordHash)) throw new Error('Invalid credentials');
  return user;
}

export type AuthedRequest = Request & { userId?: string };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing bearer token' });
  try {
    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.userId = String(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
