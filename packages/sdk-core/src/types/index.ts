export type ChainKind = 'evm' | 'lithic' | 'bitcoin' | 'solana';

export type TokenStandard = 'native' | 'erc20' | 'spl' | 'lrc20' | 'btc' | 'lep100';

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface NetworkConfig {
  id: string;
  chainId: number;
  name: string;
  kind: ChainKind;
  rpcUrls: string[];
  blockExplorerUrl?: string;
  nativeCurrency: NativeCurrency;
  extras?: Record<string, string | number | boolean>;
}

export interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  chainIds: number[];
  addresses: Record<number, string>;
  standard?: TokenStandard;
  lep100?: {
    module?: string;
    version?: string;
    assetId?: string;
    verifiedSource?: 'registry' | 'imported';
    sourceChain?: 'makalu';
    syncMode?: 'rpc' | 'explorer' | 'hybrid';
    explorerAddressPreview?: string;
    contractAddressStatus?: 'verified' | 'preview-only' | 'unresolved';
  };
  icon?: string;
  externalUrl?: string;
  verified?: boolean;
}

export interface WalletAccount {
  curve: 'secp256k1' | 'ed25519';
  networkId: string;
  chainId: number;
  address: string;
  name: string;
  derivationPath: string;
  publicKey?: string;
}

export interface WalletState {
  mnemonic?: string;
  accounts: WalletAccount[];
  activeAccount?: WalletAccount;
  activeChainId: number;
  initializedAt?: string;
  importedTokens?: TokenConfig[];
  walletConnectSessions?: WalletConnectSession[];
}

export interface SendAssetRequest {
  chainId: number;
  to: string;
  amount: string;
  tokenAddress?: string;
  memo?: string;
}

export interface BitcoinSendRequest {
  networkId: 'bitcoin-mainnet' | 'bitcoin-testnet';
  to: string;
  amountSats: number;
  feeRateSatPerVb?: number;
}

export interface SolanaSendRequest {
  chainId: number;
  to: string;
  amount: string;
  mintAddress?: string;
  decimals?: number;
}

export interface LithicCallRequest {
  chainId: number;
  contract: string;
  method: string;
  args: unknown[];
  value?: string;
  gasLimit?: string;
}

export interface Lep100ReadRequest {
  chainId: number;
  contractAddress: string;
  owner?: string;
  spender?: string;
}

export interface Lep100TransferRequest {
  chainId: number;
  contractAddress: string;
  from?: string;
  to: string;
  amount: string;
  decimals?: number;
  memo?: string;
}

export interface Lep100ApproveRequest {
  chainId: number;
  contractAddress: string;
  owner?: string;
  spender: string;
  amount: string;
  decimals?: number;
}

export interface Lep100TokenMetadata {
  chainId: number;
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply?: string;
  verified?: boolean;
  logoUrl?: string;
}

export interface Lep100Balance {
  owner: string;
  balance: string;
  token: Lep100TokenMetadata;
}

export interface Lep100Allowance {
  owner: string;
  spender: string;
  allowance: string;
  token: Lep100TokenMetadata;
}

export interface Lep100TransferEvent {
  chainId: number;
  contractAddress: string;
  from: string;
  to: string;
  amount: string;
  txHash: string;
  blockNumber?: number;
  logIndex?: number;
  timestamp?: string;
}

export interface Lep100ApprovalEvent {
  chainId: number;
  contractAddress: string;
  owner: string;
  spender: string;
  amount: string;
  txHash: string;
  blockNumber?: number;
  logIndex?: number;
  timestamp?: string;
}

export interface Lep100IndexerSpec {
  standard: 'lep100';
  chainIds: number[];
  metadataMethodNames: {
    name: string;
    symbol: string;
    decimals: string;
    totalSupply: string;
  };
  balanceMethodName: string;
  allowanceMethodName: string;
  transferMethodName: string;
  approveMethodName: string;
  transferEventName: string;
  approvalEventName: string;
  storage: {
    tokenTable: string;
    balanceTable: string;
    approvalTable: string;
    eventTable: string;
  };
}

export interface Lep100SyncJob {
  id: string;
  chainId: number;
  mode: 'bootstrap' | 'incremental' | 'backfill';
  status: 'queued' | 'running' | 'completed' | 'failed';
  cursor?: string;
  tokensDiscovered?: number;
  eventsIndexed?: number;
  startedAt: string;
  updatedAt: string;
}

export interface Lep100ApprovalRecord {
  chainId: number;
  contractAddress: string;
  owner: string;
  spender: string;
  amount: string;
  symbol?: string;
  updatedAt: string;
}

export interface Lep100TokenListResponse {
  chainId: number;
  items: Array<TokenConfig & { contractAddress?: string; holders?: number }>;
}

export interface Lep100ActivityItem {
  id: string;
  chainId: number;
  contractAddress: string;
  symbol: string;
  kind: 'transfer' | 'approval' | 'revoke';
  direction?: 'in' | 'out' | 'self';
  amount: string;
  counterparty?: string;
  spender?: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

export interface SwapQuoteRequest {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  amount: string;
  slippageBps?: number;
  walletAddress: string;
}

export interface SwapQuote {
  provider: 'multx';
  quoteId: string;
  amountIn: string;
  amountOut: string;
  route: string[];
  estimatedSeconds: number;
  feeUsd?: string;
}

export interface SwapExecutionResult {
  provider: 'multx';
  status: 'submitted' | 'pending' | 'completed';
  executionId: string;
  approvalTxHash?: string;
  swapTxHash?: string;
}

export interface BridgeStatus {
  executionId: string;
  provider: 'multx';
  status: 'quoted' | 'submitted' | 'bridging' | 'settling' | 'completed' | 'failed';
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  sourceTxHash?: string;
  destinationTxHash?: string;
  explorerUrls?: string[];
  updatedAt: string;
}

export interface SimulationIssue {
  level: 'info' | 'warning' | 'critical';
  code: string;
  message: string;
}

export interface SimulationReport {
  chainId: number;
  summary: string;
  estimatedFee?: string;
  issues: SimulationIssue[];
  raw?: unknown;
}

export interface WebsiteRiskReport {
  hostname: string;
  score: number;
  verdict: 'allow' | 'review' | 'block';
  reasons: string[];
}

export interface IntentRequest {
  id: string;
  title: string;
  kind: 'swap' | 'bridge' | 'stake' | 'contract' | 'send' | 'send-btc' | 'send-sol' | 'lep100-transfer';
  payload: Record<string, unknown>;
}

export interface TokenImportRequest {
  chainId: number;
  address: string;
  symbol?: string;
  decimals?: number;
  name?: string;
  standard?: TokenConfig['standard'];
}

export interface PortfolioAsset {
  chainId: number;
  symbol: string;
  name: string;
  balance: string;
  usdValue?: string;
  change24hPct?: number;
  tokenAddress?: string;
}

export interface ActivityItem {
  id: string;
  chainId: number;
  kind: 'send' | 'receive' | 'swap' | 'bridge' | 'contract' | 'dnns';
  status: 'pending' | 'confirmed' | 'failed';
  title: string;
  amount?: string;
  symbol?: string;
  txHash?: string;
  createdAt: string;
}

export interface PortfolioSnapshot {
  walletAddress: string;
  totalUsd: string;
  assets: PortfolioAsset[];
  activity: ActivityItem[];
  updatedAt: string;
}

export interface DnnsRecord {
  name: string;
  address: string;
  chainId: number;
  resolver?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface DnnsRegistrationRequest {
  chainId: number;
  name: string;
  owner: string;
  years?: number;
}

export interface WalletConnectSession {
  topic: string;
  peerName: string;
  peerUrl?: string;
  chainIds: number[];
  methods: string[];
  accounts: string[];
  createdAt: string;
}
