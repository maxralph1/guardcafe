import { validateEnv } from '../../../config/env.validation.js';

/** The smallest set of variables that makes validation pass. */
const validEnv = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'secret',
  DB_NAME: 'guardcafe_test',
};

/** Returns the error message thrown by `fn`, or undefined if it did not throw. */
const messageOf = (fn) => {
  try {
    fn();
  } catch (error) {
    return error.message;
  }
  return undefined;
};

describe('validateEnv', () => {
  describe('defaults', () => {
    it('fills in every optional variable', () => {
      const env = validateEnv(validEnv);

      expect(env).toMatchObject({
        APP_ENV: 'development',
        PORT: 3000,
        API_PREFIX: '/api/v1',
        CORS_ORIGIN: '',
        DB_TYPE: 'postgres',
        DB_LOGGING: false,
        DB_SYNCHRONIZE: false,
        DB_POOL_MAX: 20,
        DB_CONNECTION_TIMEOUT_MS: 10000,
        LOG_LEVEL: 'info',
        RATE_LIMIT_WINDOW_MS: 900000,
        RATE_LIMIT_MAX: 100,
        ARGON2_MEMORY_KIB: 19456,
        ARGON2_TIME_COST: 2,
        ARGON2_PARALLELISM: 1,
      });
    });

    it('does not modify the object it was given', () => {
      const raw = { ...validEnv };

      validateEnv(raw);

      expect(raw).toEqual(validEnv);
    });

    it('passes through variables it does not know about', () => {
      const env = validateEnv({ ...validEnv, SOMETHING_ELSE: 'kept' });

      expect(env.SOMETHING_ELSE).toBe('kept');
    });
  });

  describe('type conversion', () => {
    it('turns numeric strings into numbers', () => {
      const env = validateEnv({
        ...validEnv,
        PORT: '8080',
        DB_PORT: '6543',
        RATE_LIMIT_MAX: '250',
      });

      expect(env.PORT).toBe(8080);
      expect(env.DB_PORT).toBe(6543);
      expect(env.RATE_LIMIT_MAX).toBe(250);
    });

    it('turns "true" and "false" into booleans', () => {
      const env = validateEnv({ ...validEnv, DB_LOGGING: 'true', DB_SYNCHRONIZE: 'false' });

      expect(env.DB_LOGGING).toBe(true);
      expect(env.DB_SYNCHRONIZE).toBe(false);
    });
  });

  describe('required database settings', () => {
    it('reports every missing variable at once', () => {
      const message = messageOf(() => validateEnv({}));

      expect(message).toContain('Invalid environment configuration');
      for (const name of ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME']) {
        expect(message).toContain(`"${name}" is required`);
      }
    });

    it('allows an empty DB_PASSWORD', () => {
      const env = validateEnv({ ...validEnv, DB_PASSWORD: '' });

      expect(env.DB_PASSWORD).toBe('');
    });

    it('rejects an empty DB_HOST', () => {
      expect(() => validateEnv({ ...validEnv, DB_HOST: '' })).toThrow(/"DB_HOST"/);
    });

    it('rejects a database type other than postgres', () => {
      expect(() => validateEnv({ ...validEnv, DB_TYPE: 'mysql' })).toThrow(/"DB_TYPE"/);
    });
  });

  describe('APP_ENV', () => {
    it.each(['development', 'production', 'test'])('accepts "%s"', (value) => {
      expect(validateEnv({ ...validEnv, APP_ENV: value }).APP_ENV).toBe(value);
    });

    it('rejects anything else', () => {
      const message = messageOf(() => validateEnv({ ...validEnv, APP_ENV: 'staging' }));

      expect(message).toContain('"APP_ENV" must be one of');
    });
  });

  describe('limits', () => {
    it.each([
      ['PORT', '0'],
      ['PORT', '70000'],
      ['DB_POOL_MAX', '0'],
      ['DB_CONNECTION_TIMEOUT_MS', '500'],
      ['RATE_LIMIT_WINDOW_MS', '999'],
      ['RATE_LIMIT_MAX', '0'],
    ])('rejects %s=%s', (name, value) => {
      expect(() => validateEnv({ ...validEnv, [name]: value })).toThrow(new RegExp(`"${name}"`));
    });

    it('rejects an unknown LOG_LEVEL', () => {
      expect(() => validateEnv({ ...validEnv, LOG_LEVEL: 'verbose' })).toThrow(/"LOG_LEVEL"/);
    });

    it('rejects a boolean written as anything but true or false', () => {
      expect(() => validateEnv({ ...validEnv, DB_LOGGING: 'yes' })).toThrow(/"DB_LOGGING"/);
    });

    it.each([
      ['ARGON2_MEMORY_KIB', '1024'],
      ['ARGON2_TIME_COST', '1'],
      ['ARGON2_PARALLELISM', '0'],
    ])('refuses weak password-hashing setting %s=%s', (name, value) => {
      expect(() => validateEnv({ ...validEnv, [name]: value })).toThrow(new RegExp(`"${name}"`));
    });
  });
});
