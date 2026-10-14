import { EntitySchema } from 'typeorm';

/**
 * This tracks every important action taken on an incident.
 */
export const IncidentEvent = new EntitySchema({
  name: 'IncidentEvent',
  tableName: 'incident_events',
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
      /** e.g. incident_created, incident_submitted, review_started, incident_assigned, evidence_added, severity_changed, review_outcome_recorded, incident_closed, incident_reopened. */
    },
    /** Human-readable description of what happened. */
    description: {
      type: 'text',
      nullable: true,
    },
    /** Used when the event represents a workflow status transition. */
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
    /** Optional previous and new severity values. */
    previousSeverity: {
      name: 'previous_severity',
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    newSeverity: {
      name: 'new_severity',
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    /** Optional structured event-specific details. Do not store secrets or unnecessary sensitive information here. */
    metadata: {
      type: 'jsonb',
      nullable: true,
    },
    /** Helps correlate events with HTTP requests, workers, or other services. */
    correlationId: {
      name: 'correlation_id',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    /** When the action actually occurred. */
    occurredAt: {
      name: 'occurred_at',
      type: 'timestamptz',
      nullable: false,
    },
    /** When the event record was inserted into the database. */
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
      nullable: false,
    },

    /** Incident associated with this event. */
    incidentId: {
      name: 'incident_id',
      type: 'uuid',
      nullable: false,
    },
    /** User responsible for the action. Nullable for system-generated events. */
    actorUserId: {
      name: 'actor_user_id',
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    incident: {
      type: 'many-to-one',
      target: 'Incident',
      inverseSide: 'events',
      joinColumn: {
        name: 'incident_id',
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
      name: 'IDX_INCIDENT_EVENTS_INCIDENT_OCCURRED',
      columns: ['incidentId', 'occurredAt'],
    },
    {
      name: 'IDX_INCIDENT_EVENTS_TYPE_OCCURRED',
      columns: ['eventType', 'occurredAt'],
    },
    {
      name: 'IDX_INCIDENT_EVENTS_ACTOR_OCCURRED',
      columns: ['actorUserId', 'occurredAt'],
    },
    {
      name: 'IDX_INCIDENT_EVENTS_CORRELATION',
      columns: ['correlationId'],
    },
  ],
});
