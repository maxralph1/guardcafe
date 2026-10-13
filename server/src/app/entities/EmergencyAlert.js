import { EntitySchema } from 'typeorm'; 

/**
 * Silent panic button events. 
 * Emergency alerts are operationally sensitive records.
 * Preserve them for incident investigation and accountability.
 *
 * The database stores the alert's current state. 
 * For a complete history of status transitions, use a separate append-only emergency-alert event or audit-log table.
 */
export const EmergencyAlert = new EntitySchema({
  name: 'EmergencyAlert', 
  tableName: 'emergency_alerts', 
  columns: {
    id: {
      type: 'uuid', 
      primary: true, 
      generated: 'uuid', 
    }, 
    triggeredAt: {
      name: 'triggered_at', 
      type: 'timestamptz', 
      createDate: true, 
      nullable: false,
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
    accuracyM: {
      name: 'accuracy_m', 
      type: 'numeric', 
      precision: 8, 
      scale: 2, 
      nullable: true, 
      /** GPS accuracy */
    }, 
    status: {
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'active',   // active, acknowledged, responding, resolved, false_alarm, cancelled 
    }, 
    severity: {
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'high',   // low, medium, high, critical 
    }, 
    acknowledgedByUserId: {
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
    resolvedByUserId: {
      name: 'resolved_by',
      type: 'uuid',
      nullable: true, 
      /** 
      foreignKey: { 
        target: "users", // User
       }, 
       */
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
    checkInScheduleId: {
      name: 'check_in_schedule_id',
      type: 'uuid',
      nullable: true,
    }, 
  }, 
  relations: {
    resolvedByUser: {
      type: 'many-to-one',
      target: 'User', 
      joinColumn: {
        name: 'resolved_by',
        referencedColumnName: 'id',
      },
      nullable: true, 
      onDelete: 'RESTRICT', 
    }, 
    acknowledgedByUser: {
      type: 'many-to-one',
      target: 'User', 
      joinColumn: {
        name: 'acknowledged_by',
        referencedColumnName: 'id',
      },
      nullable: true, 
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
    checkInSchedule: {
      type: 'many-to-one',
      target: 'CheckInSchedule',
      joinColumn: {
        name: 'check_in_schedule_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    }, 
    emergencyAlertEvents: {
      type: 'one-to-many',
      target: 'EmergencyAlertEvent',
      inverseSide: 'emergencyAlert',
    },
    emergencyAlertNotifications: {
      type: 'one-to-many',
      target: 'EmergencyAlertNotification',
      inverseSide: 'emergencyAlert',
    }, 
    emergencyAlertResponders: {
      type: 'one-to-many',
      target: 'EmergencyAlertResponder',
      inverseSide: 'emergencyAlert',
    },
  },
  indices: [
    {
      name: 'IDX_EMERGENCY_ALERTS_STATUS_TRIGGERED',
      columns: ['status', 'triggeredAt'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_SEVERITY_STATUS',
      columns: ['severity', 'status'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_OFFICER_TRIGGERED',
      columns: ['officerId', 'triggeredAt'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_SHIFT_ID',
      columns: ['shiftId'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_SITE_STATUS',
      columns: ['siteId', 'status'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_ACKNOWLEDGED_BY',
      columns: ['acknowledgedByUserId'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_RESOLVED_BY',
      columns: ['resolvedByUserId'],
    },

    {
      name: 'IDX_EMERGENCY_ALERTS_CHECK_IN_SCHEDULE_ID',
      columns: ['checkInScheduleId'],
    },
  ], 
});