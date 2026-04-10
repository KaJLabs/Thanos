import type { LithicCallRequest, SimulationReport } from '../types';
import { getNetworkByChainId } from '../chains/networks';

export interface LithicTransport {
  call(method: string, params: unknown[]): Promise<unknown>;
}

export interface LithicRpcMethods {
  chainInfo: string;
  runtimeInfo: string;
  estimateGas: string;
  simulateContract: string;
  callContract: string;
  deployContract: string;
  resolveDnns: string;
  readonlyContract: string;
}

const DEFAULT_METHODS: LithicRpcMethods = {
  chainInfo: 'lith_chainInfo',
  runtimeInfo: 'lithic_runtimeInfo',
  estimateGas: 'lithic_estimateGas',
  simulateContract: 'lithic_simulateContract',
  callContract: 'lithic_callContract',
  deployContract: 'lithic_deployContract',
  resolveDnns: 'dnns_resolve',
  readonlyContract: 'lithic_callReadonly'
};

export class RpcLithicTransport implements LithicTransport {
  constructor(private readonly rpcUrl: string) {}

  async call(method: string, params: unknown[]): Promise<unknown> {
    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params })
    });

    const json = await response.json();
    if (json.error) throw new Error(json.error.message || 'Lithic RPC error');
    return json.result;
  }
}

export class LithicClient {
  constructor(
    private readonly transportFactory?: (chainId: number) => LithicTransport,
    private readonly methods: LithicRpcMethods = DEFAULT_METHODS
  ) {}

  private getTransport(chainId: number): LithicTransport {
    if (this.transportFactory) return this.transportFactory(chainId);
    const network = getNetworkByChainId(chainId);
    return new RpcLithicTransport(network.rpcUrls[0]);
  }

  async getChainInfo(chainId: number): Promise<unknown> {
    return this.getTransport(chainId).call(this.methods.chainInfo, []);
  }

  async getRuntimeInfo(chainId: number): Promise<unknown> {
    return this.getTransport(chainId).call(this.methods.runtimeInfo, []);
  }

  async estimateGas(request: LithicCallRequest): Promise<unknown> {
    return this.getTransport(request.chainId).call(this.methods.estimateGas, [request]);
  }

  async simulateContract(request: LithicCallRequest): Promise<SimulationReport> {
    const raw = await this.getTransport(request.chainId).call(this.methods.simulateContract, [request]);
    return {
      chainId: request.chainId,
      summary: `Simulation complete for ${request.contract}.${request.method}`,
      issues: [],
      raw
    };
  }

  async callContract(request: LithicCallRequest): Promise<unknown> {
    return this.getTransport(request.chainId).call(this.methods.callContract, [request]);
  }

  async callReadonly(request: LithicCallRequest): Promise<unknown> {
    return this.getTransport(request.chainId).call(this.methods.readonlyContract, [request]);
  }

  async deployContract(chainId: number, bytecode: string, constructorArgs: unknown[] = []): Promise<unknown> {
    return this.getTransport(chainId).call(this.methods.deployContract, [{ bytecode, constructorArgs }]);
  }

  async resolveDnns(chainId: number, name: string): Promise<unknown> {
    return this.getTransport(chainId).call(this.methods.resolveDnns, [name]);
  }

  async invokeRaw(chainId: number, method: string, params: unknown[] = []): Promise<unknown> {
    return this.getTransport(chainId).call(method, params);
  }
}
