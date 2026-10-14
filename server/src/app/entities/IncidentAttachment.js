import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

export const IncidentAttachment = new EntitySchema({
  name: 'IncidentAttachment',
  tableName: 'incident_attachments',
  columns: {
    ...baseColumns,
    fileType: {
      name: 'file_type',
      type: 'varchar',
      length: 50,
      nullable: false, // image, video, audio, document, other
    },
    fileName: {
      name: 'file_name',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    mimeType: {
      name: 'mime_type',
      type: 'varchar',
      length: 150,
      nullable: true,
      // e.g. image/jpeg or application/pdf
    },
    fileSizeBytes: {
      name: 'file_size_bytes',
      type: 'bigint',
      nullable: true,
    },
    /** Private GCS object key, not a public or temporary signed URL. */
    storageKey: {
      name: 'storage_key',
      type: 'varchar',
      length: 1024,
      nullable: true,
    },
    /** SHA-256 hash of the original file, calculated server-side. */
    sha256Hash: {
      name: 'sha256_hash',
      type: 'varchar',
      length: 64,
      nullable: true,
    },
    /** Whether this attachment is being managed as formal evidence. */
    isEvidence: {
      name: 'is_evidence',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    evidenceStatus: {
      name: 'evidence_status',
      type: 'varchar',
      length: 30,
      nullable: true,
      // uploaded, under_review, accepted, rejected, archived
    },
    collectedAt: {
      name: 'collected_at',
      type: 'timestamptz',
      nullable: true,
    },
    capturedAt: {
      name: 'captured_at',
      type: 'timestamptz',
      nullable: true,
    },
    collectionLocation: {
      name: 'collection_location',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    latitude: {
      type: 'numeric',
      precision: 10,
      scale: 7,
      nullable: true,
    },
    longitude: {
      type: 'numeric',
      precision: 10,
      scale: 7,
      nullable: true,
    },
    /** Optional evidence source */
    sourceType: {
      name: 'source_type',
      type: 'varchar',
      length: 50,
      nullable: true,
      // officer, CCTV, witness, client.
    },
    sourceReference: {
      name: 'source_reference',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    uploadedBy: {
      name: 'uploaded_by',
      type: 'uuid',
      nullable: false,
    },
    reviewedByUserId: {
      name: 'reviewed_by_user_id',
      type: 'uuid',
      nullable: true,
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
    incidentId: {
      name: 'incident_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    incident: {
      type: 'many-to-one',
      target: 'Incident',
      joinColumn: {
        name: 'incident_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    uploader: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'uploaded_by',
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
  },
  indices: [
    {
      name: 'IDX_INCIDENT_ATTACHMENTS_INCIDENT',
      columns: ['incidentId'],
    },
    {
      name: 'IDX_INCIDENT_ATTACHMENTS_UPLOADED_BY',
      columns: ['uploadedBy'],
    },
    {
      name: 'IDX_INCIDENT_ATTACHMENTS_EVIDENCE_STATUS',
      columns: ['isEvidence', 'evidenceStatus'],
    },
    {
      name: 'IDX_INCIDENT_ATTACHMENTS_REVIEWED_BY',
      columns: ['reviewedByUserId'],
    },
    {
      name: 'IDX_INCIDENT_ATTACHMENTS_COLLECTED_AT',
      columns: ['collectedAt'],
    },
  ],
});
