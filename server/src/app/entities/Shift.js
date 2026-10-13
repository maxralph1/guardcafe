import { EntitySchema } from 'typeorm'; 
import { baseColumns } from './baseColumns.js'; 

/** 
 * A scheduled work period for one officer at one site. This is the backbone of payroll.
 * 
 * The Shift represents the scheduled assignment and its accepted actual start/end times. AttendanceEvent should preserve the underlying clock-in/clock-out event history.
 *
 * Payroll should use approved attendance and applicable compensation rules rather than blindly treating scheduled hours as worked hours.
 */
export const Shift = new EntitySchema({
  name: 'Shift', 
  tableName: 'shifts', 
  columns: {
    ...baseColumns,  
    scheduledStart: {
      name: 'scheduled_start', 
      type: 'timestamptz',
      nullable: false,
    }, 
    scheduledEnd: {
      name: 'scheduled_end',
      type: 'timestamptz',
      nullable: false,
    }, 
    /** clock-in */
    actualStart: {
      name: 'actual_start', 
      type: 'timestamptz',
      nullable: true,
    }, 
    /** clock-out */
    actualEnd: {
      name: 'actual_end', 
      type: 'timestamptz',
      nullable: true,
    }, 
    status: {
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'scheduled',   
      // scheduled, in_progress, completed, missed, cancelled, no_show
    }, 
    type: {
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'day',   
      // day, night, swing, overtime
    }, 
    /** admin/scheduler notes */
    notes: {
      name: 'notes', 
      type: 'text', 
      nullable: true,
    }, 
    notesByUserId: {
      name: 'notes_by_user_id',
      type: 'uuid',
      nullable: true, 
      /** 
      foreignKey: { 
        target: "users", // User
       }, 
       */
    }, 
    assignedByUserId: {
      name: 'assigned_by_user_id',
      type: 'uuid',
      nullable: false, 
      /** 
      foreignKey: { 
        target: "users", // User
       }, 
       */
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
    clientId: {
      name: 'client_id',
      type: 'uuid',
      nullable: false,
    }, 
    employmentId: {
      name: 'employment_id',
      type: 'uuid',
      nullable: false,
    },
  }, 
  relations: {
    assignedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'assigned_by_user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    notesByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'notes_by_user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: true,
    },
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    employment: {
      type: 'many-to-one',
      target: 'Employment',
      joinColumn: {
        name: 'employment_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    site: {
      type: 'many-to-one',
      target: 'Site',
      joinColumn: {
        name: 'site_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    attendanceEvents: {
      type: 'one-to-many',
      target: 'AttendanceEvent',
      inverseSide: 'shift',
    },
    payrollEntries: {
      type: 'one-to-many',
      target: 'PayrollEntry',
      inverseSide: 'shift',
    },
    siteCheckpointPatrols: {
      type: 'one-to-many',
      target: 'SiteCheckpointPatrol',
      inverseSide: 'shift',
    },
  },
  indices: [
    {
      name: 'IDX_SHIFTS_OFFICER_SCHEDULED_START',
      columns: ['officerId', 'scheduledStart'],
    },
    {
      name: 'IDX_SHIFTS_SITE_SCHEDULED_START',
      columns: ['siteId', 'scheduledStart'],
    },
    {
      name: 'IDX_SHIFTS_STATUS_SCHEDULED_START',
      columns: ['status', 'scheduledStart'],
    },
    {
      name: 'IDX_SHIFTS_EMPLOYMENT_SCHEDULED_START',
      columns: ['employmentId', 'scheduledStart'],
    },
    {
      name: 'IDX_SHIFTS_ASSIGNED_BY_USER',
      columns: ['assignedByUserId'],
    },
    {
      name: 'IDX_SHIFTS_NOTES_BY_USER',
      columns: ['notesByUserId'],
    },
  ],
  checks: [
    {
      name: 'CHK_SHIFTS_SCHEDULED_TIME_RANGE',
      expression: '"scheduled_end" > "scheduled_start"',
    },
    {
      name: 'CHK_SHIFTS_ACTUAL_TIME_RANGE',
      expression:
        '"actual_start" IS NULL OR "actual_end" IS NULL OR "actual_end" > "actual_start"',
    },
    {
      name: 'CHK_SHIFTS_STATUS',
      expression:
        `"status" IN ('scheduled', 'in_progress', 'completed', 'missed', 'cancelled', 'no_show')`,
    },
    {
      name: 'CHK_SHIFTS_TYPE',
      expression: `"type" IN ('day', 'night', 'swing', 'other')`,
    },
  ],
});