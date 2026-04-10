import type { WebsiteRiskReport } from '../types';

const blockedKeywords = ['drainer', 'seed-verify', 'claim-now', 'wallet-rectify'];
const suspiciousTlds = ['.zip', '.mov', '.xyz'];

export function inspectWebsite(hostname: string): WebsiteRiskReport {
  const lowered = hostname.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  if (blockedKeywords.some((keyword) => lowered.includes(keyword))) {
    reasons.push('Hostname matches known phishing keyword patterns.');
    score += 80;
  }

  if (suspiciousTlds.some((tld) => lowered.endsWith(tld))) {
    reasons.push('Hostname uses a high-risk top-level domain.');
    score += 35;
  }

  if (lowered.includes('metamask') && lowered !== 'metamask.io') {
    reasons.push('Lookalike brand domain detected.');
    score += 65;
  }

  return {
    hostname,
    score,
    verdict: score >= 80 ? 'block' : score >= 35 ? 'review' : 'allow',
    reasons
  };
}
