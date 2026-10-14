import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Records an actual patrol visit or scan at a site checkpoint.
 *
 * Each record represents one checkpoint visit attempt.
 * Historical patrol records should be retained for auditing.
 */
export const SiteCheckpointPatrol = new EntitySchema({
  name: 'SiteCheckpointPatrol',
  tableName: 'site_checkpoint_patrols',
  columns: {
    ...baseColumns,
    /** When the checkpoint was visited, according to the device. */
    scannedAt: {
      name: 'scanned_at',
      type: 'timestamptz',
      nullable: false,
    },
    /** When the server received and recorded the event. */
    recordedAt: {
      name: 'recorded_at',
      type: 'timestamptz',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    scanMethod: {
      name: 'scan_method',
      type: 'varchar',
      length: 30,
      nullable: false,
      // nfc, qr_code, manual, other
    },
    status: {
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'pending',
      // pending, verified, rejected, flagged
    },
    validationNotes: {
      name: 'validation_notes',
      type: 'text',
      nullable: true,
    },
    /** Location reported by the device at scan time. */
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
    /** Reported GPS accuracy, in meters. */
    locationAccuracyM: {
      name: 'location_accuracy_m',
      type: 'numeric',
      precision: 8,
      scale: 2,
      nullable: true,
    },

    /** Distance from the checkpoint, calculated by the server. */
    distanceFromCheckpointM: {
      name: 'distance_from_checkpoint_m',
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    deviceReference: {
      name: 'device_reference',
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    /** Optional reference to a unique scan request/event from the client. */
    idempotencyKey: {
      name: 'idempotency_key',
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    /** The checkpoint that was visited. */
    siteCheckpointId: {
      name: 'site_checkpoint_id',
      type: 'uuid',
      nullable: false,
    },
    /** The officer who performed the patrol. */
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
    /** The shift during which the patrol occurred. */
    shiftId: {
      name: 'shift_id',
      type: 'uuid',
      nullable: true,
    },
    /** The authenticated user who recorded the event, if applicable. */
    recordedByUserId: {
      name: 'recorded_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    /** Optional review information. */
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
  },
  relations: {
    siteCheckpoint: {
      type: 'many-to-one',
      target: 'SiteCheckpoint',
      joinColumn: {
        name: 'site_checkpoint_id',
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
    shift: {
      type: 'many-to-one',
      target: 'Shift',
      joinColumn: {
        name: 'shift_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    recordedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'recorded_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
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
      name: 'IDX_SITE_CHECKPOINT_PATROLS_CHECKPOINT_TIME',
      columns: ['siteCheckpointId', 'scannedAt'],
    },
    {
      name: 'IDX_SITE_CHECKPOINT_PATROLS_OFFICER_TIME',
      columns: ['officerId', 'scannedAt'],
    },
    {
      name: 'IDX_SITE_CHECKPOINT_PATROLS_SHIFT',
      columns: ['shiftId'],
    },
    {
      name: 'IDX_SITE_CHECKPOINT_PATROLS_STATUS_TIME',
      columns: ['status', 'scannedAt'],
    },
    {
      name: 'IDX_SITE_CHECKPOINT_PATROLS_RECORDED_BY',
      columns: ['recordedByUserId'],
    },
    {
      name: 'IDX_SITE_CHECKPOINT_PATROLS_REVIEWED_BY',
      columns: ['reviewedByUserId'],
    },
    {
      name: 'UQ_SITE_CHECKPOINT_PATROLS_IDEMPOTENCY',
      columns: ['idempotencyKey'],
      unique: true,
    },
  ],
  checks: [
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_SCAN_METHOD',
      expression: `"scan_method" IN (
        'nfc',
        'qr_code',
        'manual',
        'other'
      )`,
    },
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_STATUS',
      expression: `"status" IN (
        'pending',
        'verified',
        'rejected',
        'flagged'
      )`,
    },
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_LATITUDE',
      expression: '"latitude" IS NULL OR "latitude" BETWEEN -90 AND 90',
    },
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_LONGITUDE',
      expression: '"longitude" IS NULL OR "longitude" BETWEEN -180 AND 180',
    },
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_LOCATION_PAIR',
      expression: `(
        ("latitude" IS NULL AND "longitude" IS NULL)
        OR
        ("latitude" IS NOT NULL AND "longitude" IS NOT NULL)
      )`,
    },
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_LOCATION_ACCURACY',
      expression: '"location_accuracy_m" IS NULL OR "location_accuracy_m" >= 0',
    },
    {
      name: 'CHK_SITE_CHECKPOINT_PATROLS_DISTANCE',
      expression: '"distance_from_checkpoint_m" IS NULL OR "distance_from_checkpoint_m" >= 0',
    },
  ],
});
