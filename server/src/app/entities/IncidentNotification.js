import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Track who was notified about an incident, when they were notified, and which communication method was used
 */
export const IncidentNotification = new EntitySchema({
  name: 'IncidentNotification',
  tableName: 'incident_notifications',
  columns: {
    ...baseColumns,
    method: {
      type: 'varchar',
      length: 50,
      default: 'push', // push, sms, email,  voice_call, in_app
    },
    status: {
      name: 'status',
      type: 'varchar',
      length: 30,
      default: 'pending',
      nullable: false,
      // pending, sending, sent, delivered, failed, cancelled
    },
    externalContact: {
      name: 'external_contact',
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    /** When the provider successfully accepts/sends the notification. */
    notifiedAt: {
      name: 'notified_at',
      type: 'timestamptz',
      nullable: true,
    },
    notifiedUserId: {
      name: 'notified_user_id',
      type: 'uuid',
      nullable: true,
    },
    deliveredAt: {
      name: 'delivered_at',
      type: 'timestamptz',
      nullable: true,
    },
    failedAt: {
      name: 'failed_at',
      type: 'timestamptz',
      nullable: true,
    },
    failureReason: {
      name: 'failure_reason',
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
      inverseSide: 'notifications',
      joinColumn: {
        name: 'incident_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    notifiedUser: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'incidentNotifications',
      joinColumn: {
        name: 'notified_user_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'IDX_INCIDENT_NOTIFICATIONS_INCIDENT',
      columns: ['incidentId'],
    },
    {
      name: 'IDX_INCIDENT_NOTIFICATIONS_USER',
      columns: ['notifiedUserId'],
    },
    {
      name: 'IDX_INCIDENT_NOTIFICATIONS_STATUS',
      columns: ['status'],
    },
    {
      name: 'IDX_INCIDENT_NOTIFICATIONS_INCIDENT_STATUS',
      columns: ['incidentId', 'status'],
    },
  ],
});
