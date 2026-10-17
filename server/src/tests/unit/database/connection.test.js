import path from 'node:path';
import config from '../../../config/index.js';
import AppDataSource, { sslOptions } from '../../../config/database.js';

describe('database connection settings', () => {
  it('uses PostgreSQL', () => {
    expect(AppDataSource.options.type).toBe('postgres');
  });

  it('never changes the schema on its own: only migrations do', () => {
    expect(AppDataSource.options.synchronize).toBe(false);
  });

  it('reads migrations from database/migrations', () => {
    const [glob] = AppDataSource.options.migrations;

    expect(path.normalize(glob).split(path.sep).slice(-3)).toEqual([
      'database',
      'migrations',
      '*.js',
    ]);
  });

  it('keeps the migration history in a table called "migrations"', () => {
    expect(AppDataSource.options.migrationsTableName).toBe('migrations');
  });
});

describe('sslOptions', () => {
  it('turns SSL off when it is not wanted', () => {
    expect(sslOptions(false)).toBe(false);
  });

  it('turns SSL on and verifies the server certificate', () => {
    expect(sslOptions(true)).toEqual({ rejectUnauthorized: true });
  });

  it('is what the data source uses, following DB_SSL', () => {
    expect(AppDataSource.options.ssl).toEqual(sslOptions(config.db.ssl));
  });
});
