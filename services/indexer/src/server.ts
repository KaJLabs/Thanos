import cors from 'cors';
import express from 'express';
import { buildSeedActivity, getMakaluSeedTokenList, runMakaluSync, seededApprovals } from './lep100-sync';

const app = express();
app.use(cors());
app.use(express.json());

const now = () => new Date().toISOString();

app.get('/health', (_req, res) => res.json({ ok: true, service: 'wallet-indexer' }));

app.get('/portfolio/:walletAddress', (req, res) => {
  const walletAddress = req.params.walletAddress;
  res.json({
    walletAddress,
    totalUsd: '128450.22',
    updatedAt: now(),
    assets: [
      { chainId: 700777, symbol: 'LITHO', name: 'Lithosphere', balance: '8450', usdValue: '42250', change24hPct: 3.4 },
      { chainId: 700777, symbol: 'COLLE', name: 'Colle AI', balance: '1500', usdValue: '2250', change24hPct: 1.4, tokenAddress: process.env.MAKALU_LEP100_COLLE_ADDRESS || 'preview:0xE7eBf52b...60DF49' },
      { chainId: 700777, symbol: 'AGII', name: 'AGII', balance: '2400', usdValue: '3200', change24hPct: 2.1, tokenAddress: process.env.MAKALU_LEP100_AGII_ADDRESS || 'preview:0x9984ad7a...6Fe020' },
      { chainId: 1000000, symbol: 'BTC', name: 'Bitcoin', balance: '0.52', usdValue: '41600', change24hPct: 1.2 },
      { chainId: 900, symbol: 'SOL', name: 'Solana', balance: '155', usdValue: '13800', change24hPct: -0.8 }
    ],
    activity: [
      { id: '1', chainId: 700777, kind: 'send', status: 'confirmed', title: 'Sent LITHO', amount: '42', symbol: 'LITHO', txHash: '0xabc', createdAt: now() },
      { id: '2', chainId: 700777, kind: 'swap', status: 'pending', title: 'MultX route to SOL', amount: '25', symbol: 'LITHO', txHash: '0xdef', createdAt: now() }
    ]
  });
});

app.get('/activity/:walletAddress', (req, res) => res.json({ walletAddress: req.params.walletAddress, items: [] }));

app.get('/lep100/spec', (_req, res) => {
  res.json({
    standard: 'lep100',
    chainIds: [700777, 700778],
    tables: ['lep100_tokens', 'lep100_balances', 'lep100_allowances', 'lep100_events', 'lep100_sync_jobs'],
    eventNames: ['Transfer', 'Approval'],
    notes: [
      'Index metadata from contract calls: name, symbol, decimals, totalSupply',
      'Track holders by replaying Transfer events',
      'Store approvals for spender risk review',
      'Resolve owner addresses in both 0x and litho1 forms where the chain exposes a dual-address account model'
    ]
  });
});

app.get('/lep100/tokens', (req, res) => {
  const chainId = Number(req.query.chainId || 700777);
  const seeded = getMakaluSeedTokenList();
  res.json({ ...seeded, chainId });
});

app.get('/lep100/balances/:walletAddress', (req, res) => {
  const seeded = getMakaluSeedTokenList();
  res.json({
    walletAddress: req.params.walletAddress,
    items: seeded.items.slice(0, 3).map((token, index) => ({
      symbol: token.symbol,
      balance: ['1500', '2400', '320'][index] || '0',
      contractAddress: token.contractAddress || token.lep100?.explorerAddressPreview || 'unresolved'
    }))
  });
});

app.get('/lep100/activity/:walletAddress', (req, res) => {
  const walletAddress = req.params.walletAddress;
  res.json({ walletAddress, items: buildSeedActivity(walletAddress) });
});

app.get('/lep100/approvals/:walletAddress', (req, res) => {
  const walletAddress = req.params.walletAddress;
  res.json({
    walletAddress,
    items: seededApprovals.map((item) => ({ ...item, owner: walletAddress }))
  });
});

app.post('/lep100/sync', async (req, res) => {
  const mode = (req.body?.mode || 'incremental') as 'bootstrap' | 'incremental' | 'backfill';
  const sync = await runMakaluSync(mode);
  res.json(sync);
});

const port = Number(process.env.PORT || 4010);
app.listen(port, () => console.log(`wallet-indexer listening on ${port}`));
