import { migrate, status } from '../../commands/database/migrate.js';
import { connectTestDatabase, disconnectTestDatabase } from '../support/database.js';

/**
 * Needs a real database: run with `npm run test:database`. The first run migrates an empty
 * database, which can take a minute or two; later runs find nothing pending and are quick.
 */
describe('the migrated database', () => {
  let dataSource;

  beforeAll(async () => {
    dataSource = await connectTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('has recorded every migration as run, with no file missing', async () => {
    const { pending, missing } = await status(dataSource);

    expect(pending).toEqual([]);
    expect(missing).toEqual([]);
  });

  it('has a table for every entity, and no others', async () => {
    const rows = await dataSource.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    );

    const actual = rows.map((row) => row.table_name).filter((name) => name !== 'migrations');
    const expected = dataSource.entityMetadatas.map((metadata) => metadata.tableName);

    expect(actual.sort()).toEqual(expected.sort());
  });

  it('matches the entities exactly: no change is waiting to be turned into a migration', async () => {
    /** The same comparison `npm run migration:generate` makes. If this fails, an entity was changed without generating a migration for it; the queries show what is missing. */
    const { upQueries } = await dataSource.driver.createSchemaBuilder().log();

    expect(upQueries.map(({ query }) => query)).toEqual([]);
  });

  it('can run its migrations again without changing anything', async () => {
    expect(await migrate(dataSource)).toEqual([]);
  });
});
