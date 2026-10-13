import { EntitySchema } from 'typeorm'; 
/** import { User } from './User.js'; */
/** import { Officer } from './Officer.js'; */
/** import { Client } from './Client.js'; */
/** 
import { Site } from './Site.js';
import { CheckInSchedule } from './CheckInSchedule.js'; 
*/

/**
 * Escalations generated when an officer misses a scheduled check-in. 
 * Alerts should be retained as historical security records. 
 * Prefer resolving or archiving alerts rather than deleting them.
 * Feeds the admin dashboard live.
 */
export const CheckInAlert = new EntitySchema({
  name: 'CheckInAlert', 
  tableName: 'check_in_alerts', 
  columns: {
    id: {
      type: 'uuid', 
      primary: true, 
      generated: 'uuid', 
    }, 
    alertLevel: {
      name: 'alert_level', 
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'warning',   // warning, critical
    }, 
    alertedAt: {
      name: 'alerted_at', 
      type: 'timestamptz',
      nullable: false, 
      default: () => 'CURRENT_TIMESTAMP', 
    }, 
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true, 
      nullable: false, 
    }, 
    acknowledgedById: {
      name: 'acknowledged_by',
      type: 'uuid',
      nullable: true, 
      /** 
      foreignKey: { 
        target: "users", // User
       }, 
       */
    }, 
    acknowledgedAt: {
      name: 'acknowledged_at', 
      type: 'timestamptz',
      nullable: true,
    }, 
    resolvedAt: {
      name: 'resolved_at',
      type: 'timestamptz',
      nullable: true,
    }, 
    resolutionNotes: {
      name: 'resolution_notes', 
      type: 'text', 
      nullable: true, 
      /** by supervising staff / admin */
    }, 
    checkInScheduleId: {
      name: 'check_in_schedule_id',
      type: 'uuid',
      nullable: false,
    }, 
    officerId: {
      name: 'officer_id',
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
    acknowledgedBy: {
      type: 'many-to-one',
      target: 'User', 
      joinColumn: {
        name: 'acknowledged_by',
        referencedColumnName: 'id',
      },
      nullable: true, 
      onDelete: 'RESTRICT', 
    }, 
    checkInSchedule: {
      type: 'many-to-one',
      target: 'CheckInSchedule',  
      joinColumn: {
        name: 'check_in_schedule_id',
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
      name: 'IDX_CHECK_IN_ALERTS_SCHEDULE_ID',
      columns: ['checkInScheduleId'],
    },
    {
      name: 'IDX_CHECK_IN_ALERTS_OFFICER_ID',
      columns: ['officerId'],
    },
    {
      name: 'IDX_CHECK_IN_ALERTS_SITE_ID',
      columns: ['siteId'],
    },
    {
      name: 'IDX_CHECK_IN_ALERTS_LEVEL_ALERTED_AT',
      columns: ['alertLevel', 'alertedAt'],
    },
    {
      name: 'IDX_CHECK_IN_ALERTS_ACKNOWLEDGED_BY',
      columns: ['acknowledgedById'],
    },
  ],
});