import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Records each payment attempt or transfer, including its amount, method, status, reference, and timestamps.
 * Every individual payment attempt or transfer gets its own record.
 * A failed transfer must remain recorded even if the officer is subsequently paid successfully through another transaction. 
 * Generate UNIQUE transaction numbers and idempotency keys in your application or payment service. Do not reuse a key for a different payment operation.
 */
export const StaffPaymentTransaction = new EntitySchema({
  name: 'StaffPaymentTransaction',
  tableName: 'staff_payment_transactions',
  columns: {
    ...baseColumns,
    transactionNumber: {
      name: 'transaction_number',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    amount: {
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
    paymentMethod: {
      name: 'payment_method',
      type: 'varchar',
      length: 30,
      nullable: false,
      // bank_transfer, cash, cheque, mobile_money, other
    },
    status: {
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'pending',
      // pending, processing, succeeded, failed, cancelled
    },
    providerReference: {
      name: 'provider_reference',
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    initiatedAt: {
      name: 'initiated_at',
      type: 'timestamptz',
      nullable: true,
    },
    completedAt: {
      name: 'completed_at',
      type: 'timestamptz',
      nullable: true,
    },
    failedAt: {
      name: 'failed_at',
      type: 'timestamptz',
      nullable: true,
    },
    failureReason: {
      name: 'failure_reason',
      type: 'text',
      nullable: true,
    },
    notes: {
      type: 'text',
      nullable: true,
    },
    metadata: {
      type: 'jsonb',
      nullable: true,
    },
    /** idempotencyKey prevents a retried request from accidentally creating a duplicate transaction. PostgreSQL allows multiple NULL values in a normal unique index, so transactions without an idempotency key can coexist. */
    idempotencyKey: {
      name: 'idempotency_key',
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    staffPaymentId: {
      name: 'staff_payment_id',
      type: 'uuid',
      nullable: false,
    }, 
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
    processedByUserId: {
      name: 'processed_by_user_id',
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    staffPayment: {
      type: 'many-to-one',
      target: 'StaffPayment',
      inverseSide: 'transactions',
      joinColumn: {
        name: 'staff_payment_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    }, 
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      inverseSide: 'transactions',
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
    
    attachments: {
      type: 'one-to-many',
      target: 'StaffPaymentTransactionAttachment',
      inverseSide: 'staffPaymentTransaction',
    },
  },
  indices: [
    {
      name: 'UQ_STAFF_PAYMENT_TRANSACTIONS_NUMBER',
      columns: ['transactionNumber'],
      unique: true,
    },
    {
      name: 'UQ_STAFF_PAYMENT_TRANSACTIONS_IDEMPOTENCY',
      columns: ['idempotencyKey'],
      unique: true,
    },
    {
      name: 'IDX_STAFF_PAYMENT_TRANSACTIONS_PAYMENT',
      columns: ['staffPaymentId'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TRANSACTIONS_PAYMENT_STATUS',
      columns: ['staffPaymentId', 'status'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TRANSACTIONS_PROVIDER_REFERENCE',
      columns: ['providerReference'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TRANSACTIONS_PROCESSED_BY',
      columns: ['processedByUserId'],
    },
  ],
  checks: [
    {
      name: 'CHK_STAFF_PAYMENT_TRANSACTIONS_AMOUNT',
      expression: '"amount" > 0',
    },
    {
      name: 'CHK_STAFF_PAYMENT_TRANSACTIONS_STATUS',
      expression: `"status" IN (
        'pending',
        'processing',
        'succeeded',
        'failed',
        'cancelled'
      )`,
    },
    {
      name: 'CHK_STAFF_PAYMENT_TRANSACTIONS_METHOD',
      expression: `"payment_method" IN (
        'bank_transfer',
        'cash',
        'cheque',
        'mobile_money',
        'other'
      )`,
    },
  ],
});