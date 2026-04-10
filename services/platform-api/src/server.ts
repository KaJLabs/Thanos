import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { issueSession, login, register, requireAuth, type AuthedRequest } from './auth';
import { ids, loadDb, saveDb } from './store';
import { indexerGet, indexerPost } from './indexer-client';

const app = express();
app.use(cors());
app.use(express.json());

const version = process.env.API_VERSION || '0.9.0';
const now = () => new Date().toISOString();

app.get('/health', (_req, res) => res.json({ ok: true, service: 'platform-api', version }));

app.post('/auth/register', (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(8), displayName: z.string().optional() }).parse(req.body);
  try {
    const user = register(body.email, body.password, body.displayName);
    const session = issueSession(user.id);
    res.json({ ...session, user: { id: user.id, email: user.email, displayName: user.displayName } });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'register failed' });
  }
});

app.post('/auth/login', (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
  try {
    const user = login(body.email, body.password);
    const session = issueSession(user.id);
    res.json({ ...session, user: { id: user.id, email: user.email, displayName: user.displayName } });
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : 'login failed' });
  }
});

app.get('/auth/me', requireAuth, (req: AuthedRequest, res) => {
  const db = loadDb();
  const user = db.users.find((item) => item.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, email: user.email, displayName: user.displayName } });
});

app.get('/contacts', requireAuth, (req: AuthedRequest, res) => {
  const db = loadDb();
  res.json({ items: db.contacts.filter((item) => item.userId === req.userId) });
});

app.post('/contacts', requireAuth, (req: AuthedRequest, res) => {
  const body = z.object({ label: z.string().min(1), address: z.string().min(4), chainId: z.number().optional(), notes: z.string().optional() }).parse(req.body);
  const db = loadDb();
  const record = { id: ids.next(), userId: req.userId!, createdAt: now(), ...body };
  db.contacts.push(record);
  saveDb(db);
  res.status(201).json(record);
});

app.get('/wallets/drafts', requireAuth, (req: AuthedRequest, res) => {
  const db = loadDb();
  res.json({ items: db.drafts.filter((item) => item.userId === req.userId) });
});

app.post('/wallets/drafts', requireAuth, (req: AuthedRequest, res) => {
  const body = z.object({ from: z.string().min(4), to: z.string().min(4), amount: z.string().min(1), chainId: z.number(), assetSymbol: z.string().min(1), memo: z.string().optional() }).parse(req.body);
  const db = loadDb();
  const record = { id: ids.next(), userId: req.userId!, createdAt: now(), ...body };
  db.drafts.push(record);
  saveDb(db);
  res.status(201).json(record);
});

app.get('/portfolio/:walletAddress', async (req, res) => res.json(await indexerGet(`/portfolio/${encodeURIComponent(req.params.walletAddress)}`)));
app.get('/activity/:walletAddress', async (req, res) => res.json(await indexerGet(`/activity/${encodeURIComponent(req.params.walletAddress)}`)));
app.get('/lep100/spec', async (_req, res) => res.json(await indexerGet('/lep100/spec')));
app.get('/lep100/tokens', async (req, res) => res.json(await indexerGet(`/lep100/tokens?chainId=${req.query.chainId || 700777}`)));
app.get('/lep100/balances/:walletAddress', async (req, res) => res.json(await indexerGet(`/lep100/balances/${encodeURIComponent(req.params.walletAddress)}`)));
app.get('/lep100/activity/:walletAddress', async (req, res) => res.json(await indexerGet(`/lep100/activity/${encodeURIComponent(req.params.walletAddress)}`)));
app.get('/lep100/approvals/:walletAddress', async (req, res) => res.json(await indexerGet(`/lep100/approvals/${encodeURIComponent(req.params.walletAddress)}`)));
app.post('/lep100/sync', requireAuth, async (req: AuthedRequest, res) => {
  const mode = z.object({ mode: z.enum(['bootstrap', 'incremental', 'backfill']).optional() }).parse(req.body).mode || 'incremental';
  res.json(await indexerPost('/lep100/sync', { mode, requestedBy: req.userId }));
});

app.get('/dnns/resolve/:name', (req, res) => {
  res.json({ name: req.params.name, resolvedAddress: '0x1111111111111111111111111111111111111111', reverse: 'litho1exampleaddress0000000000000000000000', cachedAt: now() });
});

app.get('/openapi.json', (_req, res) => {
  res.json({
    openapi: '3.1.0',
    info: { title: 'Wallet Platform API', version },
    servers: [{ url: 'http://localhost:4020' }],
    paths: {
      '/health': { get: { summary: 'Health check' } },
      '/auth/register': { post: { summary: 'Register user' } },
      '/auth/login': { post: { summary: 'Login user' } },
      '/auth/me': { get: { summary: 'Current user' } },
      '/contacts': { get: { summary: 'List contacts' }, post: { summary: 'Create contact' } },
      '/wallets/drafts': { get: { summary: 'List drafts' }, post: { summary: 'Create draft' } },
      '/portfolio/{walletAddress}': { get: { summary: 'Portfolio' } },
      '/activity/{walletAddress}': { get: { summary: 'Activity' } },
      '/lep100/tokens': { get: { summary: 'LEP100 tokens' } },
      '/lep100/balances/{walletAddress}': { get: { summary: 'LEP100 balances' } },
      '/lep100/activity/{walletAddress}': { get: { summary: 'LEP100 activity' } },
      '/lep100/approvals/{walletAddress}': { get: { summary: 'LEP100 approvals' } },
      '/lep100/sync': { post: { summary: 'Trigger LEP100 sync' } },
      '/dnns/resolve/{name}': { get: { summary: 'Resolve DNNS name' } }
    }
  });
});

const port = Number(process.env.PORT || 4020);
app.listen(port, () => console.log(`platform-api listening on ${port}`));
