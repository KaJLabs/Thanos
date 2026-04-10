'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserSecureStore, WalletEngine, type WalletState } from '@thanos/sdk-core';

const WalletContext = createContext<WalletEngine | null>(null);
const WalletStateContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const engine = useMemo(() => new WalletEngine(new BrowserSecureStore('thanos-web')), []);
  const [state, setState] = useState<WalletState | null>(null);

  useEffect(() => {
    engine.bootstrap().then(setState).catch(console.error);
    const unsubscribe = engine.store.subscribe((next) => setState(next));
    return unsubscribe;
  }, [engine]);

  return (
    <WalletContext.Provider value={engine}>
      <WalletStateContext.Provider value={state}>{children}</WalletStateContext.Provider>
    </WalletContext.Provider>
  );
}

export function useWalletEngine(): WalletEngine {
  const engine = useContext(WalletContext);
  if (!engine) throw new Error('WalletProvider missing');
  return engine;
}

export function useWalletState(): WalletState | null {
  return useContext(WalletStateContext);
}
