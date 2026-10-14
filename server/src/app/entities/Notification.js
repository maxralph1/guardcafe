import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * In-app notification feed per user.
 *
 *  A notification is a user-facing message, not the authoritative record for an emergency, incident, or check-in event.
 */
export const Notification = new EntitySchema({
  name: 'Notification',
  tableName: 'notifications',
  columns: {
    ...baseColumns,
    type: {
      name: 'type',
      type: 'varchar',
      length: 50,
      nullable: false,
      // missed_checkin, emergency, shift_assigned, incident_update, system, etc
    },
    title: {
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    body: {
      type: 'text',
      nullable: true,
    },
    payload: {
      type: 'jsonb',
      nullable: true,
      /** deep-link data */
    },
    isRead: {
      name: 'is_read',
      type: 'boolean',
      default: false,
    },
    readAt: {
      name: 'read_at',
      type: 'timestamptz',
      nullable: true,
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'notifications',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'IDX_NOTIFICATIONS_USER_ID',
      columns: ['userId'],
      unique: false,
    },
    {
      name: 'IDX_NOTIFICATIONS_USER_CREATED',
      columns: ['userId', 'createdAt'],
    },
    {
      name: 'IDX_NOTIFICATIONS_TYPE_CREATED',
      columns: ['type', 'createdAt'],
    },
  ],
});
