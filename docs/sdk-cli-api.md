# SDK, CLI, and API

This repo now includes a GitHub-ready platform interface layer alongside the wallet apps:

- `packages/sdk-core` - wallet engine, chain clients, LEP100, swaps, DNNS, WalletConnect, hardware integrations
- `packages/sdk-api` - typed HTTP client for the backend API
- `apps/cli` - command-line interface for health checks, portfolio, DNNS, and LEP100 operations
- `services/platform-api` - production-style API service for auth, contacts, tx drafts, portfolio proxying, and LEP100 sync
- `services/indexer` - indexer and LEP100 sync service

## Quick start

```bash
pnpm install
pnpm --filter @thanos/indexer dev
pnpm --filter @thanos/platform-api dev
pnpm --filter @thanos/cli dev -- health
```

## CLI examples

```bash
thanos health --api http://localhost:4020
thanos wallet:create
thanos portfolio 0xabc...
thanos lep100:tokens --chain-id 700777
thanos lep100:sync --mode incremental
```

## SDK API client example

```ts
import { PlatformApiClient } from '@thanos/sdk-api';

const api = new PlatformApiClient({ baseUrl: 'http://localhost:4020' });
const session = await api.login({ email: 'ops@example.com', password: 'supersecurepass' });
api.setAccessToken(session.accessToken);
const portfolio = await api.portfolio('0xabc...');
```

## Platform API endpoints

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET/POST /contacts`
- `GET/POST /wallets/drafts`
- `GET /portfolio/:walletAddress`
- `GET /activity/:walletAddress`
- `GET /lep100/spec`
- `GET /lep100/tokens`
- `GET /lep100/balances/:walletAddress`
- `GET /lep100/activity/:walletAddress`
- `GET /lep100/approvals/:walletAddress`
- `POST /lep100/sync`
- `GET /dnns/resolve/:name`

## Production notes

- Replace file-backed auth/contact storage with Postgres before public launch.
- Rotate JWT secrets via a managed secrets platform.
- Front all public endpoints with rate limiting and WAF rules.
- Restrict LEP100 sync to privileged roles in production.
