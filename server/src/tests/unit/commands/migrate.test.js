import { execute, fresh, migrate, rollback, status } from '../../../commands/database/migrate.js';

/** A stand-in for TypeORM's DataSource that records what it is asked to do. */
const fakeDataSource = ({ executed = [], known = executed, tableName } = {}) => {
  const calls = [];

  return {
    calls,
    options: { migrationsTableName: tableName ?? 'migrations' },
    migrations: known.map((name) => ({ name })),
    runMigrations: async (options) => {
      calls.push(['runMigrations', options]);
      return known.filter((name) => !executed.includes(name)).map((name) => ({ name }));
    },
    undoLastMigration: async (options) => {
      calls.push(['undoLastMigration', options]);
    },
    dropDatabase: async () => {
      calls.push(['dropDatabase']);
    },
    showMigrations: async () => {
      calls.push(['showMigrations']);
      return false;
    },
    query: async (sql) => {
      calls.push(['query', sql]);
      return executed.map((name) => ({ name }));
    },
  };
};

/** Runs `execute` and returns the exit code with every line it printed. */
const run = async (args, dataSource, options = {}) => {
  const lines = [];
  const code = await execute(args, dataSource, { ...options, out: (line) => lines.push(line) });

  return { code, lines };
};

const rejectionOf = async (promise) => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  return undefined;
};

describe('migrate', () => {
  it('runs the pending migrations, each in its own transaction, and returns their names', async () => {
    const dataSource = fakeDataSource({
      executed: ['First1700000000001'],
      known: ['First1700000000001', 'Second1700000000002'],
    });

    expect(await migrate(dataSource)).toEqual(['Second1700000000002']);
    expect(dataSource.calls).toEqual([['runMigrations', { transaction: 'each' }]]);
  });
});

describe('status', () => {
  it('separates the migrations that ran from the ones that are pending', async () => {
    const dataSource = fakeDataSource({
      executed: ['First1700000000001'],
      known: ['First1700000000001', 'Second1700000000002'],
    });

    expect(await status(dataSource)).toEqual({
      executed: ['First1700000000001'],
      pending: ['Second1700000000002'],
      missing: [],
    });
  });

  it('flags a migration that ran but has no file in this project', async () => {
    const dataSource = fakeDataSource({ executed: ['Old1700000000009'], known: [] });

    expect(await status(dataSource)).toEqual({
      executed: ['Old1700000000009'],
      pending: [],
      missing: ['Old1700000000009'],
    });
  });

  it('makes sure the migrations table exists before reading it', async () => {
    const dataSource = fakeDataSource();

    await status(dataSource);

    expect(dataSource.calls.map(([name]) => name)).toEqual(['showMigrations', 'query']);
    expect(dataSource.calls[1][1]).toContain('"migrations"');
  });

  it('reads the migrations table in the order the migrations were made', async () => {
    const dataSource = fakeDataSource();

    await status(dataSource);

    expect(dataSource.calls[1][1]).toContain('ORDER BY "timestamp", "id"');
  });

  it('refuses a migrations table name that is not a plain identifier', async () => {
    const dataSource = fakeDataSource({ tableName: 'migrations"; DROP TABLE users; --' });

    const error = await rejectionOf(status(dataSource));

    expect(error.message).toContain('Unsafe migrations table name');
    expect(dataSource.calls.map(([name]) => name)).not.toContain('query');
  });

  it('falls back to the class name for migrations without a name property', async () => {
    class Third1700000000003 {}
    const dataSource = { ...fakeDataSource(), migrations: [new Third1700000000003()] };

    expect((await status(dataSource)).pending).toEqual(['Third1700000000003']);
  });
});

describe('fresh', () => {
  it('drops every table, then runs every migration', async () => {
    const dataSource = fakeDataSource({ executed: [], known: ['First1700000000001'] });

    expect(await fresh(dataSource)).toEqual(['First1700000000001']);
    expect(dataSource.calls.map(([name]) => name)).toEqual(['dropDatabase', 'runMigrations']);
  });
});

describe('rollback', () => {
  it('reverts the most recent migration and returns its name', async () => {
    const dataSource = fakeDataSource({ executed: ['First1700000000001', 'Second1700000000002'] });

    expect(await rollback(dataSource)).toBe('Second1700000000002');
    expect(dataSource.calls).toContainEqual(['undoLastMigration', { transaction: 'each' }]);
  });

  it('does nothing when no migration has run', async () => {
    const dataSource = fakeDataSource({ executed: [], known: ['First1700000000001'] });

    expect(await rollback(dataSource)).toBeUndefined();
    expect(dataSource.calls.map(([name]) => name)).not.toContain('undoLastMigration');
  });
});

describe('execute', () => {
  it('runs migrations when there is no option, and says what it ran', async () => {
    const dataSource = fakeDataSource({ executed: [], known: ['First1700000000001'] });

    const { code, lines } = await run([], dataSource);

    expect(code).toBe(0);
    expect(lines).toEqual(['Migrated First1700000000001']);
  });

  it('says so when there is nothing to migrate', async () => {
    const { code, lines } = await run([], fakeDataSource({ executed: ['First1700000000001'] }));

    expect(code).toBe(0);
    expect(lines).toEqual(['Nothing to migrate.']);
  });

  it('lists the status with --status', async () => {
    const dataSource = fakeDataSource({
      executed: ['First1700000000001'],
      known: ['First1700000000001', 'Second1700000000002'],
    });

    const { code, lines } = await run(['--status'], dataSource);

    expect(code).toBe(0);
    expect(lines).toEqual(['  ran      First1700000000001', '  pending  Second1700000000002']);
  });

  it('marks a migration that ran but has no file', async () => {
    const dataSource = fakeDataSource({ executed: ['Old1700000000009'], known: [] });

    const { lines } = await run(['--status'], dataSource);

    expect(lines).toEqual(['  ran      Old1700000000009   (no migration file found)']);
  });

  it('says so when there are no migrations at all', async () => {
    const { lines } = await run(['--status'], fakeDataSource());

    expect(lines).toEqual(['No migrations found.']);
  });

  it('rolls back with --rollback', async () => {
    const { code, lines } = await run(
      ['--rollback'],
      fakeDataSource({ executed: ['First1700000000001'] }),
    );

    expect(code).toBe(0);
    expect(lines).toEqual(['Rolled back First1700000000001']);
  });

  it('says so when there is nothing to roll back', async () => {
    const { lines } = await run(['--rollback'], fakeDataSource());

    expect(lines).toEqual(['Nothing to roll back.']);
  });

  it('refuses to roll back in production without --force', async () => {
    const dataSource = fakeDataSource({ executed: ['First1700000000001'] });

    const { code, lines } = await run(['--rollback'], dataSource, { production: true });

    expect(code).toBe(1);
    expect(lines[0]).toContain('Refusing to roll back in production');
    expect(dataSource.calls).toEqual([]);
  });

  it('rolls back in production when --force is given', async () => {
    const dataSource = fakeDataSource({ executed: ['First1700000000001'] });

    const { code } = await run(['--rollback', '--force'], dataSource, { production: true });

    expect(code).toBe(0);
    expect(dataSource.calls.map(([name]) => name)).toContain('undoLastMigration');
  });

  it('wipes and rebuilds the database with --fresh --force', async () => {
    const dataSource = fakeDataSource({ executed: [], known: ['First1700000000001'] });

    const { code, lines } = await run(['--fresh', '--force'], dataSource);

    expect(code).toBe(0);
    expect(lines).toEqual(['Dropped all tables.', 'Migrated First1700000000001']);
  });

  it('refuses --fresh without --force, and touches nothing', async () => {
    const dataSource = fakeDataSource({ executed: ['First1700000000001'] });

    const { code, lines } = await run(['--fresh'], dataSource);

    expect(code).toBe(1);
    expect(lines[0]).toContain('Add --force to go ahead');
    expect(dataSource.calls).toEqual([]);
  });

  it('refuses --fresh in production, even with --force', async () => {
    const dataSource = fakeDataSource({ executed: ['First1700000000001'] });

    const { code, lines } = await run(['--fresh', '--force'], dataSource, { production: true });

    expect(code).toBe(1);
    expect(lines).toEqual(['Refusing to wipe the database in production.']);
    expect(dataSource.calls).toEqual([]);
  });

  it('rejects an unknown option without touching the database', async () => {
    const dataSource = fakeDataSource();

    const { code, lines } = await run(['--wipe'], dataSource);

    expect(code).toBe(1);
    expect(lines[0]).toContain('Unknown option "--wipe"');
    expect(dataSource.calls).toEqual([]);
  });
});
