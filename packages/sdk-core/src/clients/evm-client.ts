import { BrowserProvider, Contract, JsonRpcProvider, Wallet, parseUnits } from 'ethers';
import type { SendAssetRequest } from '../types';
import { getNetworkByChainId } from '../chains/networks';

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

export class EvmClient {
  getProvider(chainId: number): JsonRpcProvider {
    const network = getNetworkByChainId(chainId);
    return new JsonRpcProvider(network.rpcUrls[0], chainId);
  }

  async sendAsset(privateKey: string, request: SendAssetRequest): Promise<string> {
    const provider = this.getProvider(request.chainId);
    const wallet = new Wallet(privateKey, provider);

    if (!request.tokenAddress) {
      const tx = await wallet.sendTransaction({
        to: request.to,
        value: parseUnits(request.amount, 18)
      });
      return tx.hash;
    }

    const token = new Contract(request.tokenAddress, ERC20_ABI, wallet);
    const decimals = await token.decimals();
    const tx = await token.transfer(request.to, parseUnits(request.amount, decimals));
    return tx.hash;
  }

  async approveIfRequired(privateKey: string, request: { chainId: number; tokenAddress: string; spender: string; amount: string }): Promise<string | null> {
    const provider = this.getProvider(request.chainId);
    const wallet = new Wallet(privateKey, provider);
    const token = new Contract(request.tokenAddress, ERC20_ABI, wallet);
    const allowance = await token.allowance(wallet.address, request.spender);
    const decimals = await token.decimals();
    const target = parseUnits(request.amount, decimals);
    if (allowance >= target) return null;
    const tx = await token.approve(request.spender, target);
    return tx.hash;
  }

  wrapInjectedProvider(provider: Eip1193Provider): BrowserProvider {
    return new BrowserProvider(provider);
  }
}

export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<unknown>;
}
