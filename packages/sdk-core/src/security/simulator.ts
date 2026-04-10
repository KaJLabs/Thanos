import { formatUnits } from 'ethers';
import { getNetworkByChainId } from '../chains/networks';
import type { LithicCallRequest, SendAssetRequest, SimulationReport } from '../types';
import { EvmClient } from '../clients/evm-client';
import { LithicClient } from '../clients/lithic-client';

export class TransactionSimulator {
  constructor(private readonly evm = new EvmClient(), private readonly lithic = new LithicClient()) {}

  async simulateSend(request: SendAssetRequest): Promise<SimulationReport> {
    const network = getNetworkByChainId(request.chainId);
    if (network.kind === 'lithic') {
      return this.lithic.simulateContract({
        chainId: request.chainId,
        contract: 'system.transfer',
        method: 'transfer',
        args: [request.to, request.amount]
      });
    }

    const provider = this.evm.getProvider(request.chainId);
    const feeData = await provider.getFeeData();
    return {
      chainId: request.chainId,
      summary: `Send ${request.amount} on ${network.name}`,
      estimatedFee: feeData.maxFeePerGas ? formatUnits(feeData.maxFeePerGas, 9) : undefined,
      issues: request.tokenAddress ? [] : [{ level: 'info', code: 'NATIVE_TRANSFER', message: 'Native asset transfer simulation complete.' }]
    };
  }

  async simulateLithic(request: LithicCallRequest): Promise<SimulationReport> {
    return this.lithic.simulateContract(request);
  }
}
