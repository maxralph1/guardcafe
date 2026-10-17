import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';
/** 
import { User } from './User.js'; 
import { EmergencyAlert } from './EmergencyAlert.js'; 
import { CheckInSchedule } from './CheckInSchedule.js'; 
*/

/**
 * Stores metadata for WebRTC calls. Actual media flows P2P or through a TURN server.
 * Note on WebRTC signaling: The signaling messages themselves (SDP offers/answers, ICE candidated) go over WebSockets and don't need to be persisted. Only persist the session metadata.
 * Call records should be retained according to the application's security, privacy, and data-retention policies.
 */
export const CallSession = new EntitySchema({
  name: 'CallSession',
  tableName: 'call_sessions',
  columns: {
    ...baseColumns,
    callerId: {
      name: 'caller_id',
      type: 'uuid',
      nullable: true,
    },
    calleeId: {
      name: 'callee_id',
      type: 'uuid',
      nullable: true,
    },
    callType: {
      name: 'call_type',
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'audio', // audio, video
    },
    initiatedBy: {
      name: 'initiated_by',
      type: 'varchar',
      length: 50,
      default: 'caller', // caller, system (for auto-calls on missed check-in).
    },
    initiatedByUserId: {
      name: 'initiated_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    status: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'ringing', // ringing, answered, missed, declined, ended, failed
    },
    startedAt: {
      name: 'started_at',
      type: 'timestamptz',
      nullable: true,
    },
    answeredAt: {
      name: 'answered_at',
      type: 'timestamptz',
      nullable: true,
    },
    endedAt: {
      name: 'ended_at',
      type: 'timestamptz',
      nullable: true,
    },
    emergencyAlertId: {
      name: 'emergency_alert_id',
      type: 'uuid',
      nullable: true,
    },
    checkInScheduleId: {
      name: 'check_in_schedule_id',
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    initiatedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'initiated_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    emergencyAlert: {
      type: 'many-to-one',
      target: 'EmergencyAlert',
      joinColumn: {
        name: 'emergency_alert_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'SET NULL',
    },
    checkInSchedule: {
      type: 'many-to-one',
      target: 'CheckInSchedule',
      joinColumn: {
        name: 'check_in_schedule_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'SET NULL',
    },
    caller: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'caller_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
    callee: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'callee_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'IDX_CALL_SESSIONS_CALLER_ID',
      columns: ['callerId'],
    },
    {
      name: 'IDX_CALL_SESSIONS_CALLEE_ID',
      columns: ['calleeId'],
    },
    {
      name: 'IDX_CALL_SESSIONS_INITIATED_BY_USER_ID',
      columns: ['initiatedByUserId'],
    },
    {
      name: 'IDX_CALL_SESSIONS_EMERGENCY_ALERT_ID',
      columns: ['emergencyAlertId'],
    },
    {
      name: 'IDX_CALL_SESSIONS_CHECK_IN_SCHEDULE_ID',
      columns: ['checkInScheduleId'],
    },
    {
      name: 'IDX_CALL_SESSIONS_STATUS_CREATED_AT',
      columns: ['status', 'createdAt'],
    },
  ],
});
