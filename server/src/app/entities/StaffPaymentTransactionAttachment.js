import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

export const StaffPaymentTransactionAttachment = new EntitySchema({
  name: 'StaffPaymentTransactionAttachment',
  tableName: 'staff_payment_transaction_attachments',
  columns: {
    ...baseColumns,
    type: {
      type: 'varchar',
      length: 50,
      nullable: false,
      // payment_receipt, bank_confirmation, cheque_image, failure_report, reconciliation_document, other
    },
    fileName: {
      name: 'file_name',
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    storageKey: {
      name: 'storage_key',
      type: 'varchar',
      length: 500,
      nullable: false,
    },
    mimeType: {
      name: 'mime_type',
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    fileSizeBytes: {
      name: 'file_size_bytes',
      type: 'bigint',
      nullable: false,
    },
    sha256Hash: {
      name: 'sha256_hash',
      type: 'varchar',
      length: 64,
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    status: {
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'pending_review',
      // pending_review, approved, rejected, archived
    },
    uploadedAt: {
      name: 'uploaded_at',
      type: 'timestamptz',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    reviewedAt: {
      name: 'reviewed_at',
      type: 'timestamptz',
      nullable: true,
    },
    reviewNotes: {
      name: 'review_notes',
      type: 'text',
      nullable: true,
    },
    uploadedByUserId: {
      name: 'uploaded_by_user_id',
      type: 'uuid',
      nullable: false,
    },
    reviewedByUserId: {
      name: 'reviewed_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    staffPaymentTransactionId: {
      name: 'staff_payment_transaction_id',
      type: 'uuid',
      nullable: false,
    },
    replacesAttachmentId: {
      name: 'replaces_attachment_id',
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    staffPaymentTransaction: {
      type: 'many-to-one',
      target: 'StaffPaymentTransaction',
      inverseSide: 'attachments',
      joinColumn: {
        name: 'staff_payment_transaction_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    uploadedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'uploaded_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    reviewedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'reviewed_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    replacesAttachment: {
      type: 'many-to-one',
      target: 'StaffPaymentTransactionAttachment',
      joinColumn: {
        name: 'replaces_attachment_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    replacementAttachments: {
      type: 'one-to-many',
      target: 'StaffPaymentTransactionAttachment',
      inverseSide: 'replacesAttachment',
    },
  },
  indices: [
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_TRANSACTION',
      columns: ['staffPaymentTransactionId'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_TYPE',
      columns: ['type'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_STATUS',
      columns: ['status'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_UPLOADED_BY',
      columns: ['uploadedByUserId'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_REVIEWED_BY',
      columns: ['reviewedByUserId'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_REPLACES',
      columns: ['replacesAttachmentId'],
    },
    {
      name: 'IDX_STAFF_PAYMENT_TX_ATTACHMENTS_CREATED_AT',
      columns: ['createdAt'],
    },
  ],
  checks: [
    {
      name: 'CHK_STAFF_PAYMENT_TX_ATTACHMENTS_TYPE',
      expression: `"type" IN (
        'payment_receipt',
        'bank_confirmation',
        'cheque_image',
        'failure_report',
        'reconciliation_document',
        'other'
      )`,
    },
    {
      name: 'CHK_STAFF_PAYMENT_TX_ATTACHMENTS_STATUS',
      expression: `"status" IN (
        'pending_review',
        'approved',
        'rejected',
        'archived'
      )`,
    },
    {
      name: 'CHK_STAFF_PAYMENT_TX_ATTACHMENTS_FILE_SIZE',
      expression: '"file_size_bytes" > 0',
    },
    {
      name: 'CHK_STAFF_PAYMENT_TX_ATTACHMENTS_SHA256',
      expression: '"sha256_hash" IS NULL OR "sha256_hash" ~ \'^[a-fA-F0-9]{64}$\'',
    },
  ],
});