# Thanos Wallet Architecture

## Surfaces

- Web app
- Browser extension for Chrome and Brave
- Safari Web Extension conversion target
- Mobile app for iOS and Android
- Desktop app for macOS and Windows

## Shared SDK

All clients consume `@thanos/sdk-core`, which centralizes:

- Lithosphere network defaults for Makalu and Kamet
- Token registry including LITHO, COLLE, AGII, ATUA, IMAGEN, BTC, SOL, and SPL defaults
- Wallet lifecycle and account derivation
- EVM, Lithic, Bitcoin, and Solana clients
- MultX swap and bridge adapters
- Ignite DEX deeplink launcher
- Ledger and Trezor connectors
- Transaction simulation and anti-phishing modules
