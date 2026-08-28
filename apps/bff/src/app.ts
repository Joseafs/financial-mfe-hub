import Fastify from 'fastify';
import { loadConfig, type AppConfig } from './config.js';

export function buildApp(config: AppConfig = loadConfig()) {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
    },
  });

  app.get('/health', async () => ({
    status: 'ok',
    service: 'financial-mfe-bff',
    environment: config.FMH_ENV,
    timestamp: new Date().toISOString(),
  }));

  return app;
}
