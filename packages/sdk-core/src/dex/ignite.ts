export function getIgniteDexUrl(params?: { symbol?: string; chain?: string }) {
  const url = new URL('https://ignite.litho.ai/');
  if (params?.symbol) url.searchParams.set('symbol', params.symbol);
  if (params?.chain) url.searchParams.set('chain', params.chain);
  return url.toString();
}
