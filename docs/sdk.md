# SDK Usage

```ts
import { WalletEngine, MAKALU_TESTNET, SOLANA_MAINNET } from '@thanos/sdk-core';

const engine = new WalletEngine();
await engine.createWallet();

await engine.executeIntent({
  id: crypto.randomUUID(),
  title: 'Bridge LITHO to SOL',
  kind: 'swap',
  payload: {
    fromChainId: MAKALU_TESTNET.chainId,
    toChainId: SOLANA_MAINNET.chainId,
    fromToken: 'LITHO',
    toToken: 'SOL',
    amount: '10',
    walletAddress: engine.store.getState().activeAccount?.address
  }
});
```
