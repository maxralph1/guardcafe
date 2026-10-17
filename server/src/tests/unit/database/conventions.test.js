import pg from 'pg';
import AppDataSource from '../../../config/database.js';

/**
 * The conventions the whole schema follows, so a new entity cannot quietly break them:
 *
 *   - money is stored as whole cents in an int, never as a decimal or a float
 *   - multipliers (overtime, night differential) are numeric with two decimals: 1.50, 0.15
 *   - currency codes are lower case: 'mur'
 *   - numeric and bigint columns reach the application as numbers, not strings.
 *   - primary keys are uuids that the database generates
 *   - a decimal default on a numeric column is written as raw SQL, e.g. () => '1.5'
 */

const columns = AppDataSource.options.entities.flatMap((entity) =>
  Object.entries(entity.options.columns).map(([key, column]) => ({
    key,
    column,
    label: `${entity.options.name}.${key}`,
  })),
);

/** Rates, pay, amounts and what is due or deducted: but not the hours or multipliers behind them */
const isMoney = ({ key }) => /(rate|pay|amount|due|deductions)$/i.test(key);

describe('primary keys', () => {
  it('are uuids that the database generates', () => {
    // `generated: true` would mean an auto-increment number, which a uuid column cannot have
    const wrong = columns
      .filter(({ column }) => column.primary)
      .filter(({ column }) => column.type !== 'uuid' || column.generated !== 'uuid')
      .map(({ label, column }) => `${label} is ${column.type}, generated: ${column.generated}`);

    expect(wrong).toEqual([]);
  });
});

describe('decimal defaults', () => {
  it('are written as raw SQL, because TypeORM misreads a plain decimal default of a numeric column', () => {
    const wrong = columns
      .filter(({ column }) => column.type === 'numeric')
      .filter(
        ({ column }) => typeof column.default === 'number' && !Number.isInteger(column.default),
      )
      .map(
        ({ label, column }) =>
          `${label} has default ${column.default}: write () => '${column.default}'`,
      );

    expect(wrong).toEqual([]);
  });
});

describe('money', () => {
  const money = columns.filter(isMoney);

  it('is found by the naming convention (a guard against the check silently matching nothing)', () => {
    expect(money.map(({ label }) => label)).toEqual(
      expect.arrayContaining([
        'Employment.hourlyRate',
        'CompensationHistory.hourlyRate',
        'PayrollEntry.baseRate',
        'PayrollEntry.grossPay',
        'PayrollEntry.netPay',
        'StaffPayment.amountDue',
        'StaffPaymentTransaction.amount',
      ]),
    );
  });

  it('is stored as whole cents in an int', () => {
    const notCents = money
      .filter(({ column }) => !['int', 'integer'].includes(column.type))
      .map(({ label, column }) => `${label} is ${column.type}`);

    expect(notCents).toEqual([]);
  });
});

describe('multipliers', () => {
  const multipliers = columns.filter(({ key }) => /multiplier$/i.test(key));

  it('exist', () => {
    expect(multipliers.length).toBeGreaterThan(0);
  });

  it('are numeric with two decimals', () => {
    const wrong = multipliers
      .filter(({ column }) => column.type !== 'numeric' || column.scale !== 2)
      .map(({ label, column }) => `${label} is ${column.type}`);

    expect(wrong).toEqual([]);
  });
});

describe('currency codes', () => {
  const currencies = columns.filter(({ key }) => key === 'currencyCode');

  it('exist', () => {
    expect(currencies.length).toBeGreaterThan(0);
  });

  it('default to lower case', () => {
    const wrong = currencies
      .filter(
        ({ column }) =>
          column.default !== undefined && column.default !== column.default.toLowerCase(),
      )
      .map(({ label, column }) => `${label} defaults to "${column.default}"`);

    expect(wrong).toEqual([]);
  });
});

describe('PostgreSQL number parsing', () => {
  it('reads numeric columns as numbers', () => {
    const parse = pg.types.getTypeParser(pg.types.builtins.NUMERIC);

    expect(parse('1.50')).toBe(1.5);
    expect(parse('-6.2297000')).toBe(-6.2297);
  });

  it('reads bigint columns as numbers', () => {
    const parse = pg.types.getTypeParser(pg.types.builtins.INT8);

    expect(parse('5242880')).toBe(5242880);
  });
});
