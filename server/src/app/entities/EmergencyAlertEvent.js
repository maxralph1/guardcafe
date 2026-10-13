import { EntitySchema } from 'typeorm';

/**
 * The historical incident (emergency alert, specifically) timeline. 
 */
export const EmergencyAlertEvent = new EntitySchema({
  name: 'EmergencyAlertEvent',
  tableName: 'emergency_alert_events',

  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    eventType: {
      name: 'event_type',
      type: 'varchar',
      length: 100,
      nullable: false, 
      // alert_triggered, alert_acknowledged, responder_assigned, dispatch_started, alert_resolved, alert_reopened.
    },
    /** Human-readable summary for dashboards and incident reviews. */
    description: {
      type: 'text',
      nullable: true,
    },
    /** Optional previous and new incident status values. */
    previousStatus: {
      name: 'previous_status',
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    newStatus: {
      name: 'new_status',
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    /** Optional structured metadata. Do not put secrets or unnecessary personal data in this field. */
    metadata: {
      type: 'jsonb',
      nullable: true,
    },
    /** Useful for correlating an event with a request, worker, or trace. */
    correlationId: {
      name: 'correlation_id',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    /** When the event actually occurred. This can differ from when the row was inserted, e.g. a delayed provider callback. */
    occurredAt: {
      name: 'occurred_at',
      type: 'timestamptz',
      nullable: false,
    },
    /** Database insertion time; this should not be confused with the actual time the incident event occurred. */
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
      nullable: false,
    },
    emergencyAlertId: {
      name: 'emergency_alert_id',
      type: 'uuid',
      nullable: false,
    },
    /** Null for system-generated events. */
    actorUserId: {
      name: 'actor_user_id',
      type: 'uuid',
      nullable: true,
    },
  },

  relations: {
    emergencyAlert: {
      type: 'many-to-one',
      target: 'EmergencyAlert',
      inverseSide: 'events',
      joinColumn: {
        name: 'emergency_alert_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },

    actorUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'actor_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
  },

  indices: [
    {
      name: 'IDX_EA_EVENTS_ALERT_OCCURRED',
      columns: ['emergencyAlertId', 'occurredAt'],
    },
    {
      name: 'IDX_EA_EVENTS_TYPE_OCCURRED',
      columns: ['eventType', 'occurredAt'],
    },
    {
      name: 'IDX_EA_EVENTS_ACTOR_OCCURRED',
      columns: ['actorUserId', 'occurredAt'],
    },
    {
      name: 'IDX_EA_EVENTS_CORRELATION',
      columns: ['correlationId'],
    },
  ],
});