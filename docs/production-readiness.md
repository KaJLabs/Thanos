# Production readiness checklist

## Secure storage

- Web: encrypted localStorage wrapper in `BrowserSecureStore`
- Extension: use browser storage with encryption wrapper before release
- Mobile: Expo SecureStore / Keychain / Keystore
- Desktop: replace memory store with OS keychain bridge or encrypted file vault

## Hardware support

- Ledger transport adapters included
- Trezor Connect Web adapter included
- production release should add clear-signing schemas for Lithic transactions

## Packaging and signing

- Browser extension: add Chrome Web Store key and Safari wrapper signing
- iOS / Android: configure EAS credentials and App Store / Play Console metadata
- macOS / Windows: configure electron-builder signing and notarization variables

## Swaps and bridges

- configure final MultX API base URL and auth headers
- map route execution callbacks into transfer status polling

## Lithic runtime

- bind final RPC method names if the chain differs from the default `lithic_*` namespaced methods in the repo
