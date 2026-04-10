import { PlatformApiClient } from '@thanos/sdk-api';

async function main() {
  const api = new PlatformApiClient({ baseUrl: process.env.THANOS_API_URL || 'http://localhost:4020' });
  const session = await api.register({
    email: 'builder@example.com',
    password: 'change-me-please',
    displayName: 'Builder'
  });
  api.setAccessToken(session.accessToken);
  const portfolio = await api.portfolio('0x1111111111111111111111111111111111111111');
  console.log(portfolio);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
