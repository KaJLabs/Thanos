# LEP100 Module

## Overview

This branch adds first-class LEP100 support across the shared SDK, wallet engine, web UI, and indexer contract/event spec.

## Included in v7

- `Lep100Client` for metadata, balance, allowance, transfer, and approve flows
- Verified Makalu token registry with `LITBTC2` explicitly excluded
- Wallet engine helpers for LEP100 balance lookup and transfers
- Web dashboard section for LEP100 balances and sends
- Indexer spec endpoints describing event ingestion and storage

## Notes

The public Makalu token explorer page is dynamic. This branch ships a verified registry for the Makalu tokens already known in the repo and leaves the registry structured for adding more explorer-confirmed LEP100 contracts once the final contract addresses are available.
