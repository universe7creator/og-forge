// OG Forge - Health Check

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  return new Response(JSON.stringify({
    status: 'ok',
    product: 'og-forge',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      og: '/api/og?title=Hello&template=blog&theme=dark',
      webhook: '/api/webhook',
      health: '/api/health'
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}