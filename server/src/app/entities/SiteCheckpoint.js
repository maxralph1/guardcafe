import { EntitySchema } from 'typeorm'; 
import { baseColumns } from './baseColumns.js'; 

/**
 * Optional NFC/WR patrol checkpoints within a site (patrol route feature).
 * Checkpoints are retired by setting isActive = false.
 * Do not delete checkpoints referenced by historical patrol records.
 */
export const SiteCheckpoint = new EntitySchema({
  name: 'SiteCheckpoint', 
  tableName: 'site_checkpoints', 
  columns: {
    ...baseColumns, 
    label: {
      type: 'varchar', 
      length: 100, 
      nullable: false
    }, 
    checkpointCode: {
      name: 'checkpoint_code', 
      type: 'varchar', 
      length: 100, 
      unique: false, 
    }, 
    latitude: {
      type: 'numeric', 
      precision: 10, 
      scale: 7, 
      nullable: false,
    }, 
    longitude: {
      type: 'numeric', 
      precision: 10, 
      scale: 7, 
      nullable: false,
    }, 
    /** for patrol routes */
    sequenceOrder: {
      name: 'sequence_order', 
      type: 'int', 
      nullable: true, 
    }, 
    isActive: {
      name: 'is_active',
      type: 'boolean',
      default: false,
      nullable: false,
    }, 
    siteId: {
      name: 'site_id',
      type: 'uuid',
      nullable: false,
    }, 
    /** 
    clientId: {
      name: 'client_id',
      type: 'uuid',
      nullable: false,
    }, 
    */
  }, 
  relations: {
    site: {
      type: 'many-to-one',
      target: 'Site', 
      joinColumn: {
        name: 'site_id',
        referencedColumnName: 'id',
      },
      nullable: false, 
      onDelete: 'RESTRICT', 
    }, 
    /** 
    client: {
      type: 'many-to-one',
      target: 'Client', 
      joinColumn: {
        name: 'client_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
      nullable: false,
    }, 
    */ 
    patrols: {
      type: 'one-to-many',
      target: 'SiteCheckpointPatrol',
      inverseSide: 'siteCheckpoint',
    },
  },
  indices: [
    /** 
    {
      name: 'IDX_SITE_CHECKPOINTS_CLIENT_ID',
      columns: ['clientId'],
      unique: false,
    }, 
    */
    {
      name: 'IDX_SITE_CHECKPOINTS_SITE_ID',
      columns: ['siteId'],
      unique: false,
    }, 
    {
      name: 'UQ_SITE_CHECKPOINTS_SITE_CODE',
      columns: ['siteId', 'checkpointCode'],
      unique: true,
    },

    {
      name: 'IDX_SITE_CHECKPOINTS_SITE_ACTIVE',
      columns: ['siteId', 'isActive'],
    },

    {
      name: 'IDX_SITE_CHECKPOINTS_SITE_SEQUENCE',
      columns: ['siteId', 'sequenceOrder'],
    },
  ],

  checks: [
    {
      name: 'CHK_SITE_CHECKPOINTS_LATITUDE',
      expression: '"latitude" BETWEEN -90 AND 90',
    },

    {
      name: 'CHK_SITE_CHECKPOINTS_LONGITUDE',
      expression: '"longitude" BETWEEN -180 AND 180',
    },

    {
      name: 'CHK_SITE_CHECKPOINTS_LABEL_NOT_EMPTY',
      expression: 'length(trim(label)) > 0',
    },

    {
      name: 'CHK_SITE_CHECKPOINTS_CODE_NOT_EMPTY',
      expression: 'length(trim(checkpoint_code)) > 0',
    },

    {
      name: 'CHK_SITE_CHECKPOINTS_SEQUENCE_ORDER',
      expression: '"sequence_order" IS NULL OR "sequence_order" > 0',
    },
  ],
});