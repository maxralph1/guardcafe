import { EntitySchema } from 'typeorm';
/** 
import { baseColumns } from './baseColumns.js'; 
import { Officer } from './Officer.js'; 
import { Client } from './Client.js'; 
import { Site } from './Site.js'; 
*/

/**
 * Represents a scheduled officer check-in.
 * The escalation process scans pending schedules whose grace_until has passed.
 * Preserve schedules as historical records for incident reviews and audit purposes.
 * 'officer_id', 'scheduled_at', 'status', 'grace_until' are critical
 * the escalation cron scans these
 */
export const CheckInSchedule = new EntitySchema({
  name: 'CheckInSchedule',
  tableName: 'check_in_schedules',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    scheduledAt: {
      name: 'scheduled_at',
      type: 'timestamptz',
      nullable: false,
      /** when the officer must check in */
    },
    graceUntil: {
      name: 'grace_until',
      type: 'timestamptz',
      nullable: false,
    },
    eventTime: {
      name: 'event_time',
      type: 'timestamptz',
      nullable: false,
      /** scheduled_at + grace */
    },
    status: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'pending', // pending, completed, missed, late
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
      nullable: false,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
    shiftId: {
      name: 'shift_id',
      type: 'uuid',
      nullable: false,
    },
    siteId: {
      name: 'site_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
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
      nullable: false,
      onDelete: 'RESTRICT',
    },
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
  },
  indices: [
    {
      name: 'IDX_CHECK_IN_SCHEDULES_OFFICER_ID',
      columns: ['officerId'],
    },
    {
      name: 'IDX_CHECK_IN_SCHEDULES_SHIFT_ID',
      columns: ['shiftId'],
    },
    {
      name: 'IDX_CHECK_IN_SCHEDULES_SITE_ID',
      columns: ['siteId'],
    },
    {
      name: 'IDX_CHECK_IN_SCHEDULES_STATUS_GRACE_UNTIL',
      columns: ['status', 'graceUntil'],
    },
    {
      name: 'IDX_CHECK_IN_SCHEDULES_OFFICER_SCHEDULED_AT',
      columns: ['officerId', 'scheduledAt'],
    },
  ],
});
