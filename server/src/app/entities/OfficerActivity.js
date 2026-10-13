import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Records significant events in an officer's history.
 *
 * Employment status and employment dates belong to Employment.
 * This entity preserves a record of important activities and changes. 
 * 
 * When employmentId is provided, validate that the employment belongs to the specified officer. A foreign key on each column separately does not guarantee that the two references match.
 */
export const OfficerActivity = new EntitySchema({
  name: 'OfficerActivity',
  tableName: 'officer_activities',

  columns: {
    ...baseColumns,
    activityType: {
      name: 'activity_type',
      type: 'varchar',
      length: 100,
      nullable: false, 
      // hired, employment_terminated, promoted, demoted, transferred, suspended, reinstated, credential_verified, disciplinary_action, commendation
    },
    occurredAt: {
      name: 'occurred_at',
      type: 'timestamptz',
      nullable: false,
    },
    effectiveFrom: {
      name: 'effective_from',
      type: 'timestamptz',
      nullable: true,
    },
    effectiveTo: {
      name: 'effective_to',
      type: 'timestamptz',
      nullable: true,
    },
    description: {
      name: 'description',
      type: 'text',
      nullable: true,
    },
    metadata: {
      name: 'metadata',
      type: 'jsonb',
      nullable: true,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
    employmentId: {
      name: 'employment_id',
      type: 'uuid',
      nullable: true,
    },
    performedByUserId: {
      name: 'performed_by_user_id',
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      inverseSide: 'officerActivities',
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
      nullable: true,
    },
    performedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'performed_by_user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: true,
    },
  },
  indices: [
    {
      name: 'IDX_OFFICER_ACTIVITIES_OFFICER_OCCURRED',
      columns: ['officerId', 'occurredAt'],
    },
    {
      name: 'IDX_OFFICER_ACTIVITIES_TYPE_OCCURRED',
      columns: ['activityType', 'occurredAt'],
    },
    {
      name: 'IDX_OFFICER_ACTIVITIES_EMPLOYMENT',
      columns: ['employmentId'],
    },
    {
      name: 'IDX_OFFICER_ACTIVITIES_PERFORMED_BY',
      columns: ['performedByUserId'],
    },
  ],
});