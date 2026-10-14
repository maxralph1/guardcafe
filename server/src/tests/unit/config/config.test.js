import config from '../../../config/index.js';

describe('config', () => {
  it('runs in the test environment', () => {
    expect(config.env).toBe('test');
    expect(config.isTest).toBe(true);
    expect(config.isDev).toBe(false);
    expect(config.isProd).toBe(false);
  });

  it('uses the placeholder database from the test setup, never a developer database', () => {
    expect(config.db.database).toBe('guardcafe_test');
  });

  it('exposes values with the right types', () => {
    expect(typeof config.port).toBe('number');
    expect(typeof config.apiPrefix).toBe('string');
    expect(Array.isArray(config.corsOrigin)).toBe(true);
    expect(typeof config.db.synchronize).toBe('boolean');
    expect(typeof config.rateLimit.max).toBe('number');
    expect(typeof config.argon2.memoryCost).toBe('number');
  });

  it('is immutable', () => {
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.db)).toBe(true);
    expect(Object.isFrozen(config.rateLimit)).toBe(true);
    expect(Object.isFrozen(config.argon2)).toBe(true);
    expect(() => {
      config.port = 1;
    }).toThrow(TypeError);
  });
});
