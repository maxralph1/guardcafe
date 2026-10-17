import config from '../../config/index.js';
import { initializeDatabase, closeDatabase } from '../../config/database.js';
import { migrate, status } from '../../commands/database/migrate.js';

/**
 * Stops a test run from ever touching a real database. Tests may only use a database whose name
 * ends in "_test", and only in the test environment.
 */
export const assertTestDatabase = ({ env = config.env, database = config.db.database } = {}) => {
  if (env !== 'test') {
    throw new Error(`Database tests must run with APP_ENV=test, but APP_ENV is "${env}".`);
  }

  if (!/_test$/.test(database)) {
    throw new Error(
      `Refusing to run database tests against "${database}": the name of a test database ` +
        'must end in "_test". Put a separate database in .env.testing.',
    );
  }
};

/** Connects to the test database and brings it up to date, running only the pending migrations. */
export const connectTestDatabase = async () => {
  assertTestDatabase();

  const dataSource = await initializeDatabase();
  const { pending } = await status(dataSource);

  if (pending.length > 0) await migrate(dataSource);

  return dataSource;
};

export const disconnectTestDatabase = closeDatabase;
