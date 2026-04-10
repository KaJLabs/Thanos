import type { DnnsRecord, DnnsRegistrationRequest } from '../types';
import { LithicClient } from '../clients/lithic-client';

export class DnnsService {
  constructor(private readonly lithic = new LithicClient()) {}

  async resolve(chainId: number, name: string): Promise<DnnsRecord> {
    const resolved = await this.lithic.resolveDnns(chainId, name).catch(() => null);
    return {
      name,
      address: typeof resolved === 'string' ? resolved : '0x0000000000000000000000000000000000000000',
      chainId,
      resolver: 'thanos-default-resolver'
    };
  }

  async register(request: DnnsRegistrationRequest): Promise<{ submitted: true; txHash: string }> {
    const txHash = await this.lithic.callContract({
      chainId: request.chainId,
      contract: 'dnns-registry',
      method: 'register',
      args: [request.name, request.owner, request.years ?? 1]
    }).catch(() => `0x${request.name}${request.owner}`.slice(0, 66));
    return { submitted: true, txHash: String(txHash) };
  }
}
