import type { WalletConnectSession } from '../types';

export interface WalletConnectPairingRequest {
  uri: string;
  chainIds: number[];
  accounts: string[];
}

export class WalletConnectBridge {
  private sessions: WalletConnectSession[] = [];

  async pair(request: WalletConnectPairingRequest): Promise<WalletConnectSession> {
    const topic = request.uri.split(':')[1] || crypto.randomUUID();
    const session: WalletConnectSession = {
      topic,
      peerName: 'Connected dApp',
      peerUrl: request.uri,
      chainIds: request.chainIds,
      methods: ['eth_sendTransaction', 'personal_sign', 'lithic_callContract', 'solana_signTransaction'],
      accounts: request.accounts,
      createdAt: new Date().toISOString()
    };
    this.sessions = [session, ...this.sessions.filter((item) => item.topic !== topic)];
    return session;
  }

  listSessions(): WalletConnectSession[] {
    return this.sessions;
  }

  disconnect(topic: string) {
    this.sessions = this.sessions.filter((item) => item.topic !== topic);
  }
}
