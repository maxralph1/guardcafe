import Joi from 'joi';

const schema = Joi.object({
  APP_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  API_PREFIX: Joi.string().default('/api/v1'),
  CORS_ORIGIN: Joi.string().allow('').default(''),

  DB_TYPE: Joi.string().valid('postgres').default('postgres'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().min(1).max(65535).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),
  DB_LOGGING: Joi.boolean().truthy('true').falsy('false').default(false),
  DB_SYNCHRONIZE: Joi.boolean().truthy('true').falsy('false').default(false),
  DB_POOL_MAX: Joi.number().integer().min(1).max(200).default(20),
  DB_CONNECTION_TIMEOUT_MS: Joi.number().integer().min(1000).default(10000),

  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .default('info'),

  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(900000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),

  ARGON2_MEMORY_KIB: Joi.number().integer().min(8192).default(19456),
  ARGON2_TIME_COST: Joi.number().integer().min(2).default(2),
  ARGON2_PARALLELISM: Joi.number().integer().min(1).default(1),
}).unknown(true);

export const validateEnv = (rawEnv) => {
  const { error, value } = schema.validate(rawEnv, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return value;
};
