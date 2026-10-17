import path from 'node:path';
import { pathToFileURL } from 'node:url';
import config from '../../config/index.js';
import logger from '../../config/logger.js';
import { initializeDatabase, closeDatabase } from '../../config/database.js';

/**
 * Runs, rolls back and lists database migrations (the equivalent of `php artisan migrate`).
 *
 *   npm run db:migrate    runs every pending migration
 *   npm run db:rollback   reverts the most recent migration
 *   npm run db:status     lists which migrations have run and which are pending
 *   npm run db:fresh -- --force   drops every table, then runs every migration (never in production)
 *
 * The functions take the DataSource as a parameter so they can be tested without a database.
 */

const print = (line = '') => process.stdout.write(`${line}\n`);

/** Runs every pending migration, each in its own transaction. Returns the names it ran. */
export const migrate = async (dataSource) => {
  const ran = await dataSource.runMigrations({ transaction: 'each' });

  return ran.map((migration) => migration.name);
};

/** Lists the migrations that have run (oldest first) and the ones still pending. */
export const status = async (dataSource) => {
  // This also creates the migrations table when the database is brand new.
  await dataSource.showMigrations();

  const table = dataSource.options.migrationsTableName ?? 'migrations';

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table)) {
    throw new Error(`Unsafe migrations table name: ${table}`);
  }

  const rows = await dataSource.query(`SELECT "name" FROM "${table}" ORDER BY "timestamp", "id"`);
  const executed = rows.map((row) => row.name);
  const known = dataSource.migrations.map(
    (migration) => migration.name ?? migration.constructor.name,
  );

  return {
    executed,
    pending: known.filter((name) => !executed.includes(name)),
    // Ran on this database, but this project has no migration file for it
    missing: executed.filter((name) => !known.includes(name)),
  };
};

/** Drops every table, then runs every migration. Returns the names it ran. */
export const fresh = async (dataSource) => {
  await dataSource.dropDatabase();

  return migrate(dataSource);
};

/** Reverts the most recent migration. Returns its name, or undefined when none has run. */
export const rollback = async (dataSource) => {
  const { executed } = await status(dataSource);
  const last = executed.at(-1);

  if (last === undefined) return undefined;

  await dataSource.undoLastMigration({ transaction: 'each' });

  return last;
};

const OPTIONS = [undefined, '--status', '--rollback', '--fresh'];

/** Whether the command line asked for something this command understands. */
export const isValidUsage = (args) => OPTIONS.includes(args[0]);

/** Carries out the command line `args` and returns the exit code. */
export const execute = async (args, dataSource, { production = false, out = print } = {}) => {
  const [option] = args;

  if (!isValidUsage(args)) {
    out(
      `Unknown option "${option}". Use --status, --rollback or --fresh, or no option to run migrations.`,
    );
    return 1;
  }

  if (option === '--status') {
    const { executed, pending, missing } = await status(dataSource);
    const note = (name) => (missing.includes(name) ? '   (no migration file found)' : '');

    if (executed.length === 0 && pending.length === 0) out('No migrations found.');
    executed.forEach((name) => out(`  ran      ${name}${note(name)}`));
    pending.forEach((name) => out(`  pending  ${name}`));

    return 0;
  }

  if (option === '--rollback') {
    if (production && !args.includes('--force')) {
      out('Refusing to roll back in production. Add --force if you really mean it.');
      return 1;
    }

    const reverted = await rollback(dataSource);
    out(reverted ? `Rolled back ${reverted}` : 'Nothing to roll back.');

    return 0;
  }

  if (option === '--fresh') {
    if (production) {
      out('Refusing to wipe the database in production.');
      return 1;
    }

    if (!args.includes('--force')) {
      out('This deletes every table and all of its data. Add --force to go ahead.');
      return 1;
    }

    const ran = await fresh(dataSource);

    out('Dropped all tables.');
    if (ran.length === 0) out('Nothing to migrate.');
    ran.forEach((name) => out(`Migrated ${name}`));

    return 0;
  }

  const ran = await migrate(dataSource);

  if (ran.length === 0) out('Nothing to migrate.');
  ran.forEach((name) => out(`Migrated ${name}`));

  return 0;
};

const main = async () => {
  const args = process.argv.slice(2);

  if (!isValidUsage(args)) {
    process.exitCode = await execute(args, undefined);
    return;
  }

  const dataSource = await initializeDatabase();

  try {
    process.exitCode = await execute(args, dataSource, { production: config.isProd });
  } finally {
    await closeDatabase();
  }
};

/** Only start when run from the command line, not when imported (by the tests, for example) */
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    logger.error({ err: error }, 'Migration command failed');
    process.exitCode = 1;
  });
}
