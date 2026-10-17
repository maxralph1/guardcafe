import { assertTestDatabase } from '../../support/database.js';

describe('assertTestDatabase', () => {
  it('accepts the placeholder database the test setup configures', () => {
    expect(() => assertTestDatabase()).not.toThrow();
  });

  it('accepts any database whose name ends in _test', () => {
    expect(() => assertTestDatabase({ env: 'test', database: 'acme_test' })).not.toThrow();
  });

  it('refuses the development database, and says how to fix it', () => {
    const run = () => assertTestDatabase({ env: 'test', database: 'guardcafe' });

    expect(run).toThrow('"guardcafe"');
    expect(run).toThrow('.env.testing');
  });

  it.each(['guardcafe_testing', 'testdata', 'guardcafe_test_backup', ''])(
    'refuses "%s", because the name does not end in _test',
    (database) => {
      expect(() => assertTestDatabase({ env: 'test', database })).toThrow('must end in "_test"');
    },
  );

  it('refuses to run outside the test environment, even for a *_test database', () => {
    expect(() => assertTestDatabase({ env: 'development', database: 'guardcafe_test' })).toThrow(
      'APP_ENV=test',
    );
  });
});
