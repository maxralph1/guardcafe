import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * One row per officer per period. Computed from shifts + rates.
 * Monetary amounts and applied rates are snapshots of the calculation at the time payroll is calculated.
 *
 * Finalized payroll must not silently change when shifts, compensation history, or employment details change.
 */
export const PayrollEntry = new EntitySchema({
  name: 'PayrollEntry',
  tableName: 'payroll_entries',
  columns: {
    ...baseColumns,
    /** 
    type: {
      name: 'type',
      type: 'varchar',
      length: 30,
      nullable: false,
    }, 
    */
    regularHours: {
      name: 'regular_hours',
      type: 'numeric',
      precision: 8,
      scale: 2,
      nullable: false,
      default: 0,
    },
    overtimeHours: {
      name: 'overtime_hours',
      type: 'numeric',
      precision: 8,
      scale: 2,
      nullable: false,
      default: 0,
    },
    nightDiffHours: {
      name: 'night_diff_hours',
      type: 'numeric',
      precision: 8,
      scale: 2,
      nullable: false,
      default: 0,
    },
    /** snapshot of the hourly base pay at time of calculation */
    baseRate: {
      name: 'base_rate',
      type: 'int',
      nullable: false,
    },
    /** Actual overtime hourly rate after applying the multiplier. */
    overtimeRate: {
      name: 'overtime_rate',
      type: 'int',
      nullable: false,
    },
    /** Snapshot of the applicable overtime multiplier. */
    overtimeMultiplier: {
      name: 'overtime_multiplier',
      type: 'numeric',
      precision: 5,
      scale: 2,
      nullable: false,
    },
    /** Additional amount per eligible night-differential hour. */
    nightDiffRate: {
      name: 'night_diff_rate',
      type: 'int',
      nullable: true,
    },
    /** 15(0.15) means an additional 15%. */
    nightDiffMultiplier: {
      name: 'night_diff_multiplier',
      type: 'int',
      nullable: true,
    },
    currencyCode: {
      name: 'currency_code',
      type: 'varchar',
      length: 3,
      nullable: false,
    },
    grossPay: {
      name: 'gross_pay',
      type: 'int',
      nullable: true,
    },
    deductions: {
      name: 'deductions',
      type: 'int',
      nullable: true,
    },
    netPay: {
      name: 'net_pay',
      type: 'int',
      nullable: true,
    },
    /** Prefer structured adjustment records for material payroll adjustments. This field is for a brief summary. */
    adjustments: {
      type: 'text',
      nullable: true,
    },
    /** Actual amount paid, if different from calculated net pay. */
    actualPay: {
      name: 'actual_pay',
      type: 'int',
      nullable: true,
    },
    notes: {
      type: 'text',
      nullable: true,
    },
    status: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'draft', // draft, approved, unapproved, paid
    },
    calculatedAt: {
      name: 'calculated_at',
      type: 'timestamptz',
      nullable: true,
    },
    approvedByUserId: {
      name: 'approved_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    approvedAt: {
      name: 'approved_at',
      type: 'timestamptz',
      nullable: true,
    },
    paidAt: {
      name: 'paid_at',
      type: 'timestamptz',
      nullable: true,
    },
    payrollPeriodId: {
      name: 'payroll_period_id',
      type: 'uuid',
      nullable: false,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
    /** Useful when an officer can have multiple employment periods. */
    employmentId: {
      name: 'employment_id',
      type: 'uuid',
      nullable: true,
    },
    shiftId: {
      name: 'shift_id',
      type: 'uuid',
      nullable: false,
    },
    /** 
    staffPaymentId: {
      name: 'staff_payment_id',
      type: 'uuid',
      nullable: false,
    }, 
    */
  },
  relations: {
    payrollPeriod: {
      type: 'many-to-one',
      target: 'PayrollPeriod',
      joinColumn: {
        name: 'payroll_period_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    employment: {
      type: 'many-to-one',
      target: 'Employment',
      joinColumn: {
        name: 'employment_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    approvedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'approved_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    shift: {
      type: 'many-to-one',
      target: 'Shift',
      joinColumn: {
        name: 'shift_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    /** 
    staffPayment: {
      type: 'many-to-one',
      target: 'StaffPayment', 
      joinColumn: {
        name: 'staff_payment_id',
        referencedColumnName: 'id',
      },
      nullable: false, 
      onDelete: 'RESTRICT', 
    }, 
    */
  },
  indices: [
    {
      name: 'UQ_PAYROLL_ENTRIES_PERIOD_OFFICER',
      columns: ['payrollPeriodId', 'officerId'],
      unique: true,
    },
    {
      name: 'IDX_PAYROLL_ENTRIES_PERIOD_STATUS',
      columns: ['payrollPeriodId', 'status'],
    },
    {
      name: 'IDX_PAYROLL_ENTRIES_OFFICER',
      columns: ['officerId'],
    },
    {
      name: 'IDX_PAYROLL_ENTRIES_EMPLOYMENT',
      columns: ['employmentId'],
    },
    {
      name: 'IDX_PAYROLL_ENTRIES_APPROVED_BY',
      columns: ['approvedByUserId'],
    },
  ],
});
