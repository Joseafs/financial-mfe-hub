import { z } from 'zod';

const configSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4300),
  HOST: z.string().min(1).default('0.0.0.0'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  FMH_ENV: z.enum(['local', 'production', 'test']).default('local'),
});

export type AppConfig = z.infer<typeof configSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  return configSchema.parse({
    PORT: environment.PORT,
    HOST: environment.HOST,
    LOG_LEVEL: environment.LOG_LEVEL,
    FMH_ENV: environment.FMH_ENV,
  });
}
