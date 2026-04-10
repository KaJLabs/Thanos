# Thanos Wallet Release Configs

## Browser extension
- Chrome and Brave use the same Chromium MV3 output.
- Safari uses `xcrun safari-web-extension-converter .output/chrome-mv3`.
- Provision signing secrets in browser stores before publishing.

## Mobile
- Expo EAS production builds are configured in `apps/mobile/eas.json`.
- Fastlane wrappers are provided in `apps/mobile/fastlane`.

## Desktop
- `apps/desktop/electron-builder.yml` contains macOS and Windows packaging defaults.
- `keytar` is used for real desktop vault storage.

## CI
- GitHub Actions release workflow lives at `.github/workflows/release.yml`.
