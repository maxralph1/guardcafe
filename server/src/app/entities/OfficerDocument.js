import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Documents belonging to an officer.
 *
 * Examples:
 * - Employment contracts
 * - National ID copies
 * - Background checks
 * - Proof of address
 * - Medical certificates
 * - Supporting files for credentials
 *
 * Files should be stored in private object storage.
 * The database stores the storage key, not a public URL.
 */
export const OfficerDocument = new EntitySchema({
  name: 'OfficerDocument',
  tableName: 'officer_documents',
  columns: {
    ...baseColumns,
    type: {
      name: 'type',
      type: 'varchar',
      length: 100,
      nullable: false,
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
      length: 1024,
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
    status: {
      name: 'status',
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'pending_review',
    },
    description: {
      name: 'description',
      type: 'text',
      nullable: true,
    },
    uploadedBy: {
      name: 'uploaded_by',
      type: 'uuid',
      nullable: false,
    },
    reviewedAt: {
      name: 'reviewed_at',
      type: 'timestamptz',
      nullable: true,
    },
    reviewedByUserId: {
      name: 'reviewed_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    reviewNotes: {
      name: 'review_notes',
      type: 'text',
      nullable: true,
    },
    expiresAt: {
      name: 'expires_at',
      type: 'date',
      nullable: true,
    },
    replacesDocumentId: {
      name: 'replaces_document_id',
      type: 'uuid',
      nullable: true,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      inverseSide: 'officerDocuments',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    uploader: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'uploaded_by',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    reviewedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'reviewed_by_user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: true,
    },
    replacesDocument: {
      type: 'many-to-one',
      target: 'OfficerDocument',
      joinColumn: {
        name: 'replaces_document_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: true,
    },
  },
  indices: [
    {
      name: 'IDX_OFFICER_DOCUMENTS_OFFICER',
      columns: ['officerId'],
    },
    {
      name: 'IDX_OFFICER_DOCUMENTS_TYPE',
      columns: ['type'],
    },
    {
      name: 'IDX_OFFICER_DOCUMENTS_STATUS_CREATED',
      columns: ['status', 'createdAt'],
    },
    {
      name: 'IDX_OFFICER_DOCUMENTS_UPLOADER',
      columns: ['uploadedBy'],
    },
    {
      name: 'IDX_OFFICER_DOCUMENTS_REVIEWER',
      columns: ['reviewedByUserId'],
    },
    {
      name: 'IDX_OFFICER_DOCUMENTS_REPLACES',
      columns: ['replacesDocumentId'],
    },
  ],
});
