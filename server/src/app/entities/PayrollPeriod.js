import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';
import { User } from './User.js';

/**
 * A pay cycle (weekly, biweekly, monthly).
 */
export const PayrollPeriod = new EntitySchema({
  name: 'PayrollPeriod',
  tableName: 'payroll_periods',
  columns: {
    ...baseColumns,
    name: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    periodStart: {
      name: 'period_start',
      type: 'timestamptz',
      nullable: false,
    },
    periodEnd: {
      name: 'period_end',
      type: 'timestamptz',
      nullable: false,
    },
    status: {
      type: 'varchar',
      length: 50,
      default: 'open', // open, processing, approved, paid, closed
    },
    approvedBy: {
      name: 'approved_by',
      type: 'uuid',
      nullable: true,
    },
    approvedAt: {
      name: 'approved_at',
      type: 'timestamptz',
      nullable: true,
    },
  },
  relations: {
    approvingUser: {
      type: 'many-to-one',
      target: User,
      joinColumn: {
        name: 'approved_by',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
      nullable: true,
    },
    staffPayments: {
      type: 'one-to-many',
      target: 'StaffPayment',
      inverseSide: 'payrollPeriod',
    },
  },
  indices: [
    {
      name: 'IDX_PAYROLL_PERIODS_ID',
      columns: ['id'],
      unique: true,
    },
    {
      name: 'IDX_PAYROLL_PERIODS_APPROVED_BY',
      columns: ['approvedBy'],
      unique: false,
    },
  ],
});
