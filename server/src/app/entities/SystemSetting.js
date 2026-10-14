import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Key-value config for things you want to tune without deploying
 */
export const SystemSetting = new EntitySchema({
  name: 'SystemSetting',
  tableName: 'system_settings',
  columns: {
    ...baseColumns,
    key: {
      type: 'varchar',
      length: 100,
      primary: true,
      // e.g. default_checkin_interval
    },
    value: {
      type: 'jsonb',
    },
    description: {
      type: 'text',
      nullable: true,
    },
    updatedBy: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true,
    },
    /** 
    updatedAt: {
      name: 'updated_at', 
      type: 'timestamptz',
      nullable: true,
    }, 
    */
  },
  relations: {
    updater: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'updated_by',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
      nullable: false,
    },
  },
  indices: [
    {
      name: 'IDX_SYSTEM_SETTINGS_UPDATED_BY',
      columns: ['updatedBy'],
      unique: false,
    },
  ],
});
