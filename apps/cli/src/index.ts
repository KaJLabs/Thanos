#!/usr/bin/env node
import { Command } from 'commander';
import { PlatformApiClient } from '@thanos/sdk-api';
import { WalletEngine } from '@thanos/sdk-core';

const program = new Command();
program.name('thanos').description('CLI for wallet platform operations').version('0.9.0');

program.option('--api <url>', 'Platform API base URL', process.env.THANOS_API_URL || 'http://localhost:4020');

program.command('health').action(async () => {
  const api = new PlatformApiClient({ baseUrl: program.opts().api });
  console.log(JSON.stringify(await api.health(), null, 2));
});

program.command('wallet:create').description('Create a new local wallet in memory').action(async () => {
  const engine = new WalletEngine();
  const state = await engine.createWallet();
  console.log(JSON.stringify({ mnemonic: state.mnemonic, accounts: state.accounts }, null, 2));
});

program.command('portfolio <address>').action(async (address: string) => {
  const api = new PlatformApiClient({ baseUrl: program.opts().api });
  console.log(JSON.stringify(await api.portfolio(address), null, 2));
});

program.command('lep100:tokens').option('--chain-id <id>', 'Chain id', '700777').action(async (opts: { chainId: string }) => {
  const api = new PlatformApiClient({ baseUrl: program.opts().api });
  console.log(JSON.stringify(await api.lep100Tokens(Number(opts.chainId)), null, 2));
});

program.command('lep100:balances <address>').action(async (address: string) => {
  const api = new PlatformApiClient({ baseUrl: program.opts().api });
  console.log(JSON.stringify(await api.lep100Balances(address), null, 2));
});

program.command('lep100:sync').option('--mode <mode>', 'bootstrap|incremental|backfill', 'incremental').action(async (opts: { mode: 'bootstrap' | 'incremental' | 'backfill' }) => {
  const api = new PlatformApiClient({ baseUrl: program.opts().api });
  console.log(JSON.stringify(await api.lep100Sync(opts.mode), null, 2));
});

program.command('dnns:resolve <name>').action(async (name: string) => {
  const api = new PlatformApiClient({ baseUrl: program.opts().api });
  console.log(JSON.stringify(await api.dnnsResolve(name), null, 2));
});

program.parseAsync(process.argv);
