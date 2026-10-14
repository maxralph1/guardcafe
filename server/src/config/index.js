import dotenv from 'dotenv';
import { validateEnv } from './env.validation.js';

/**
 * Like Laravel, the "test" environment reads .env.testing instead of .env, so a developer's real settings can never leak into a test run. A missing file is ignored, and variables that are already set are never overridden.
 */
dotenv.config({
  path: process.env.APP_ENV === 'test' ? '.env.testing' : '.env',
  quiet: true,
});

const env = validateEnv(process.env);

const config = Object.freeze({
  env: env.APP_ENV,
  isProd: env.APP_ENV === 'production',
  isDev: env.APP_ENV === 'development',
  isTest: env.APP_ENV === 'test',
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  corsOrigin: env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
  logLevel: env.LOG_LEVEL,
  db: Object.freeze({
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    logging: env.DB_LOGGING,
    synchronize: env.DB_SYNCHRONIZE,
    poolMax: env.DB_POOL_MAX,
    connectionTimeoutMs: env.DB_CONNECTION_TIMEOUT_MS,
  }),
  rateLimit: Object.freeze({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  }),
  argon2: Object.freeze({
    memoryCost: env.ARGON2_MEMORY_KIB,
    timeCost: env.ARGON2_TIME_COST,
    parallelism: env.ARGON2_PARALLELISM,
  }),
});

export default config;
