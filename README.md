# Thanos Wallet

Monorepo for a Lithosphere-first multi-platform wallet suite with publishable SDK packages, a CLI, and backend APIs.

## Included surfaces

- Platform API service
- Indexer and LEP100 sync service
- Shared SDK packages
- CLI for operations and testing

## Repo layout


- `apps/cli` - platform CLI
- `packages/sdk-core` - core wallet SDK
- `packages/sdk-api` - typed API client SDK
- `packages/sdk-react` - React provider and hooks
- `packages/ui` - shared UI library
- `services/platform-api` - auth, contacts, drafts, DNNS, portfolio proxy, LEP100 sync trigger
- `services/indexer` - portfolio, activity, LEP100 tokens, balances, approvals, and sync endpoints
- `docs/` - architecture and integration docs

## Quick start

```bash
pnpm install
pnpm --filter @thanos/indexer dev
pnpm --filter @thanos/platform-api dev
pnpm --filter @thanos/cli dev -- health
```

## Publishable packages

- `@thanos/sdk-core`
- `@thanos/sdk-api`
- `@thanos/cli`

## Primary platform capabilities

- BTC, SOL/SPL, EVM, and Lithosphere flows
- LEP100 module and Makalu sync scaffolding
- WalletConnect and DNNS layers
- MultX and Ignite integration scaffolds
- Ledger and Trezor integration scaffolds
- Portfolio and activity API surfaces

## Important production note

This repository is production-oriented, but not yet fully audited. Before public launch, replace file-backed persistence with managed database-backed auth and authorization, complete the remaining hardware signing transports, validate final Lithic runtime RPC methods, and run external security review.
