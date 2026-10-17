import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AppDataSource from '../../../config/database.js';

/**
 * Checks the entity definitions against each other, without needing a database. It catches the
 * mistakes that would otherwise only show up when TypeORM starts or when a migration is generated:
 * a relation pointing at a name that does not exist, an inverse side that does not point back,
 * a forgotten primary key, and so on.
 */

const entitiesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../app/entities',
);
const entityFiles = fs
  .readdirSync(entitiesDir)
  .filter((file) => file.endsWith('.js') && file !== 'baseColumns.js')
  .sort();

const registered = AppDataSource.options.entities;
const schemas = registered.map((entity) => entity.options);
const schemaByName = new Map(schemas.map((schema) => [schema.name, schema]));

/** The database name of a column: TypeORM uses the property name unless `name` says otherwise. */
const dbName = (key, column) => column.name ?? key;

const columnKeys = (schema) => Object.keys(schema.columns);
const dbNames = (schema) => Object.entries(schema.columns).map(([key, col]) => dbName(key, col));
const columnByDbName = (schema, name) =>
  Object.entries(schema.columns).find(([key, col]) => dbName(key, col) === name)?.[1];

const targetName = (relation) =>
  typeof relation.target === 'string' ? relation.target : relation.target.options.name;

/** Relations with a join column are the owning side of a many-to-one or one-to-one. */
const owningRelations = (schema) =>
  Object.entries(schema.relations ?? {}).filter(([, relation]) => relation.joinColumn);

/** Runs `check` for every entity and collects the problems it reports. */
const collectProblems = (check) => schemas.flatMap((schema) => check(schema) ?? []);

describe('entities', () => {
  it('has every entity file registered exactly once, named after its entity', async () => {
    const problems = [];

    for (const file of entityFiles) {
      const module = await import(`../../../app/entities/${file}`);
      const exported = Object.values(module);

      if (exported.length !== 1) {
        problems.push(`${file}: exports ${exported.length} values, expected exactly one entity`);
        continue;
      }

      const [entity] = exported;
      const timesRegistered = registered.filter((candidate) => candidate === entity).length;

      if (timesRegistered !== 1) {
        problems.push(`${file}: registered ${timesRegistered} times in config/database.js`);
      }

      if (entity.options?.name !== file.replace(/\.js$/, '')) {
        problems.push(`${file}: the entity is named "${entity.options?.name}"`);
      }
    }

    expect(problems).toEqual([]);
  });

  it('registers as many entities as there are entity files', () => {
    expect(registered).toHaveLength(entityFiles.length);
  });

  it('gives every entity exactly one primary column', () => {
    const problems = collectProblems((schema) => {
      const primary = Object.entries(schema.columns).filter(([, col]) => col.primary);

      return primary.length === 1
        ? []
        : [`${schema.name}: ${primary.length} primary columns (${primary.map(([k]) => k)})`];
    });

    expect(problems).toEqual([]);
  });

  it('gives every entity its own table', () => {
    const tables = schemas.map((schema) => schema.tableName);
    const duplicates = tables.filter((table, index) => tables.indexOf(table) !== index);

    expect(duplicates).toEqual([]);
  });

  it('never gives a relation the same name as a column', () => {
    const problems = collectProblems((schema) =>
      Object.keys(schema.relations ?? {})
        .filter((name) => columnKeys(schema).includes(name))
        .map((name) => `${schema.name}.${name}: is both a column and a relation`),
    );

    expect(problems).toEqual([]);
  });

  it('points every relation at a registered entity', () => {
    const problems = collectProblems((schema) =>
      Object.entries(schema.relations ?? {})
        .filter(([, relation]) => !schemaByName.has(targetName(relation)))
        .map(
          ([name, relation]) => `${schema.name}.${name}: unknown entity "${targetName(relation)}"`,
        ),
    );

    expect(problems).toEqual([]);
  });

  it('backs every join column with a declared column that agrees on nullability', () => {
    const problems = collectProblems((schema) =>
      owningRelations(schema).flatMap(([name, relation]) => {
        const column = columnByDbName(schema, relation.joinColumn.name);
        const label = `${schema.name}.${name}`;

        if (!column) return [`${label}: join column "${relation.joinColumn.name}" is not declared`];

        /** TypeORM defaults: columns are NOT NULL, relations are nullable */
        const columnNullable = column.nullable === true;
        const relationNullable = relation.nullable !== false;

        return columnNullable === relationNullable
          ? []
          : [
              `${label}: column nullable=${columnNullable} but relation nullable=${relationNullable}`,
            ];
      }),
    );

    expect(problems).toEqual([]);
  });

  it('only joins to columns that exist on the other table', () => {
    const problems = collectProblems((schema) =>
      owningRelations(schema)
        .filter(([, relation]) => schemaByName.has(targetName(relation)))
        .flatMap(([name, relation]) => {
          const target = schemaByName.get(targetName(relation));
          const referenced = relation.joinColumn.referencedColumnName ?? 'id';

          return columnKeys(target).includes(referenced) || dbNames(target).includes(referenced)
            ? []
            : [`${schema.name}.${name}: ${target.name} has no column "${referenced}"`];
        }),
    );

    expect(problems).toEqual([]);
  });

  it('only uses SET NULL on nullable columns', () => {
    const problems = collectProblems((schema) =>
      owningRelations(schema)
        .filter(([, relation]) => relation.onDelete === 'SET NULL')
        .filter(
          ([, relation]) => columnByDbName(schema, relation.joinColumn.name)?.nullable !== true,
        )
        .map(([name]) => `${schema.name}.${name}: SET NULL on a column that is NOT NULL`),
    );

    expect(problems).toEqual([]);
  });

  it('only lets a user delete cascade to their device tokens', () => {
    /** Deleting a user must never silently delete payroll, settings or incident records. */
    const cascading = schemas.flatMap((schema) =>
      owningRelations(schema)
        .filter(([, relation]) => relation.onDelete === 'CASCADE')
        .map(([name]) => `${schema.name}.${name}`),
    );

    expect(cascading).toEqual(['DeviceToken.user']);
  });

  it('declares every inverse side, and has it point back', () => {
    const problems = collectProblems((schema) =>
      Object.entries(schema.relations ?? {})
        .filter(([, relation]) => relation.inverseSide && schemaByName.has(targetName(relation)))
        .flatMap(([name, relation]) => {
          const target = schemaByName.get(targetName(relation));
          const inverse = target.relations?.[relation.inverseSide];
          const label = `${schema.name}.${name}`;

          if (!inverse)
            return [`${label}: ${target.name} has no relation "${relation.inverseSide}"`];
          if (targetName(inverse) !== schema.name) {
            return [
              `${label}: ${target.name}.${relation.inverseSide} points at ${targetName(inverse)}`,
            ];
          }
          if (inverse.inverseSide && inverse.inverseSide !== name) {
            return [
              `${label}: ${target.name}.${relation.inverseSide} points back at "${inverse.inverseSide}"`,
            ];
          }
          return [];
        }),
    );

    expect(problems).toEqual([]);
  });

  it('gives every one-to-many relation an inverse side', () => {
    const problems = collectProblems((schema) =>
      Object.entries(schema.relations ?? {})
        .filter(([, relation]) => relation.type === 'one-to-many' && !relation.inverseSide)
        .map(([name]) => `${schema.name}.${name}: one-to-many without an inverse side`),
    );

    expect(problems).toEqual([]);
  });

  it('only indexes declared columns', () => {
    const problems = collectProblems((schema) =>
      (schema.indices ?? []).flatMap((index) =>
        index.columns
          .filter((column) => !columnKeys(schema).includes(column))
          .map((column) => `${schema.name}.${index.name}: unknown column "${column}"`),
      ),
    );

    expect(problems).toEqual([]);
  });

  it('gives every index a name that is unique across the database', () => {
    const names = schemas.flatMap((schema) => (schema.indices ?? []).map((index) => index.name));
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

    expect(names.every(Boolean)).toBe(true);
    expect(duplicates).toEqual([]);
  });
});
