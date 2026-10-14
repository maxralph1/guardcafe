import { EntitySchema } from 'typeorm';

/**
 * People and organizations assigned to an emergency alert.
 * Who responded to the alert (dispatcher, supervisor, police).
 * Tracks people or organizations involved in responding to an emergency alert.
 *
 * A responder may be an internal user, an external contact, or both.
 *
 * Preserve responder records for incident investigations and emergency-response reporting.
 */
export const EmergencyAlertResponder = new EntitySchema({
  name: 'EmergencyAlertResponder',
  tableName: 'emergency_alert_responders',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    externalContact: {
      name: 'external_contact',
      type: 'varchar',
      length: 200,
      nullable: true,
    },
    role: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    status: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'pending', // pending, notified, acknowledged, responding, completed, unavailable, cancelled
    },
    notifiedAt: {
      name: 'notified_at',
      type: 'timestamptz',
      nullable: true,
    },
    acknowledgedAt: {
      name: 'acknowledged_at',
      type: 'timestamptz',
      nullable: true,
    },
    respondedAt: {
      name: 'responded_at',
      type: 'timestamptz',
      nullable: true,
    },
    completedAt: {
      name: 'completed_at',
      type: 'timestamptz',
      nullable: true,
    },
    notes: {
      name: 'notes',
      type: 'text',
      nullable: true,
      /** by responder */
    },
    emergencyAlertId: {
      name: 'emergency_alert_id',
      type: 'uuid',
      nullable: false,
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    emergencyAlert: {
      type: 'many-to-one',
      target: 'EmergencyAlert',
      inverseSide: 'responders',
      joinColumn: {
        name: 'emergency_alert_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },

    emergencyAlertNotifications: {
      type: 'one-to-many',
      target: 'EmergencyAlertNotification',
      inverseSide: 'emergencyAlertResponder',
    },
  },
  indices: [
    {
      name: 'IDX_EA_RESPONDERS_ALERT_STATUS',
      columns: ['emergencyAlertId', 'status'],
    },

    {
      name: 'IDX_EA_RESPONDERS_USER_ID',
      columns: ['userId'],
    },

    {
      name: 'IDX_EA_RESPONDERS_STATUS_NOTIFIED',
      columns: ['status', 'notifiedAt'],
    },
  ],
});
