import type { SwapExecutionResult, SwapQuote, SwapQuoteRequest } from '../types';

export interface MultXConfig {
  apiBaseUrl: string;
  apiKey?: string;
}

export class MultXClient {
  constructor(private readonly config: MultXConfig = { apiBaseUrl: 'https://api.multx.local' }) {}

  private headers() {
    return {
      'content-type': 'application/json',
      ...(this.config.apiKey ? { authorization: `Bearer ${this.config.apiKey}` } : {})
    };
  }

  async quote(request: SwapQuoteRequest): Promise<SwapQuote> {
    const response = await fetch(`${this.config.apiBaseUrl}/quote`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error('MultX quote failed');
    return response.json();
  }

  async execute(quoteId: string, walletAddress: string): Promise<SwapExecutionResult> {
    const response = await fetch(`${this.config.apiBaseUrl}/execute`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ quoteId, walletAddress })
    });
    if (!response.ok) throw new Error('MultX execution failed');
    return response.json();
  }

  async status(executionId: string): Promise<SwapExecutionResult> {
    const response = await fetch(`${this.config.apiBaseUrl}/status/${executionId}`, {
      method: 'GET',
      headers: this.headers()
    });
    if (!response.ok) throw new Error('MultX status failed');
    return response.json();
  }
}
