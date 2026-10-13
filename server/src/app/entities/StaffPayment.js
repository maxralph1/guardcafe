import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Tracks the total amount owed, paid, currency, overall payment status, and outstanding balance.
 */
export const StaffPayment = new EntitySchema({
  name: 'StaffPayment',
  tableName: 'staff_payments',
  columns: {
    ...baseColumns,
    amountDue: {
      name: 'amount_due',
      type: 'numeric',
      precision: 14,
      scale: 2,
      nullable: false,
    },
    currencyCode: {
      name: 'currency_code',
      type: 'varchar',
      length: 3,
      nullable: false,
      default: 'MUR',
    },
    status: {
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'pending',
      // pending, partially_paid, paid, on_hold, cancelled
    },
    paymentMethod: {
      name: 'payment_method',
      type: 'varchar',
      length: 30,
      nullable: true,
      // bank_transfer, cash, cheque, mobile_money, other
    },
    notes: {
      type: 'text',
      nullable: true,
    },
    dueDate: {
      name: 'due_date',
      type: 'date',
      nullable: true,
    },
    firstPaidAt: {
      name: 'first_paid_at',
      type: 'timestamptz',
      nullable: true,
    },
    fullyPaidAt: {
      name: 'fully_paid_at',
      type: 'timestamptz',
      nullable: true,
    },
    processedByUserId: {
      name: 'processed_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    payrollPeriodId: {
      name: 'payroll_period_id',
      type: 'uuid',
      nullable: false,
    },
    /** 
    payrollEntryId: {
      name: 'payroll_entry_id',
      type: 'uuid',
      nullable: false,
    },
    */
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
  },

  relations: {
    payrollPeriod: {
      type: 'many-to-one',
      target: 'PayrollPeriod',
      inverseSide: 'staffPayments',
      joinColumn: {
        name: 'payroll_period_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    /** 
    payrollEntry: {
      type: 'one-to-one',
      target: 'PayrollEntry',
      inverseSide: 'staffPayment',
      joinColumn: {
        name: 'payroll_entry_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    */
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      inverseSide: 'staffPayments',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    processedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'processed_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    transactions: {
      type: 'one-to-many',
      target: 'StaffPaymentTransaction',
      inverseSide: 'staffPayment',
    },
  },
  indices: [
    {
      name: 'UQ_STAFF_PAYMENTS_PERIOD_OFFICER',
      columns: ['payrollPeriodId', 'officerId'],
      unique: true,
    },
    /** 
    {
      name: 'UQ_STAFF_PAYMENTS_PAYROLL_ENTRY',
      columns: ['payrollEntryId'],
      unique: true,
    },
    */
    {
      name: 'IDX_STAFF_PAYMENTS_STATUS',
      columns: ['status'],
    },
    {
      name: 'IDX_STAFF_PAYMENTS_PERIOD_STATUS',
      columns: ['payrollPeriodId', 'status'],
    },
    {
      name: 'IDX_STAFF_PAYMENTS_OFFICER',
      columns: ['officerId'],
    },
    {
      name: 'IDX_STAFF_PAYMENTS_PROCESSED_BY',
      columns: ['processedByUserId'],
    },
  ],
  checks: [
    {
      name: 'CHK_STAFF_PAYMENTS_AMOUNT_DUE',
      expression: '"amount_due" >= 0',
    },
    {
      name: 'CHK_STAFF_PAYMENTS_STATUS',
      expression: `"status" IN (
        'pending',
        'partially_paid',
        'paid',
        'on_hold',
        'cancelled'
      )`,
    },
  ],
});