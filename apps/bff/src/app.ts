import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  });

  app.get('/health', async () => ({
    status: 'ok',
    service: 'financial-mfe-bff',
    environment: process.env.FMH_ENV ?? 'local',
    timestamp: new Date().toISOString(),
  }));

  return app;
}
