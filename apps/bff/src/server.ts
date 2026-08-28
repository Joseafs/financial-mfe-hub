import { buildApp } from './app.js';

const app = buildApp();
const port = Number(process.env.PORT ?? 4300);
const host = process.env.HOST ?? '0.0.0.0';

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error, 'BFF failed to start');
  process.exit(1);
}
