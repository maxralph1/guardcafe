import { EntitySchema } from 'typeorm';

/**
 * The officer's actual response to check-in-schedule.
 * This records an officer's response to a scheduled check-in.
 * Preserve historical responses for security investigations and incident reviews.
 * Avoid deleting responses when related records are deactivated or archived.
 */
export const CheckInResponse = new EntitySchema({
  name: 'CheckInResponse',
  tableName: 'check_in_responses',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    respondedAt: {
      name: 'responded_at',
      type: 'timestamptz',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    response: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'alert', // alert, need_help, all_clear
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
    withinGeoFence: {
      name: 'within_geo_fence',
      type: 'boolean',
      nullable: true,
      /** null: the location check could not be performed or the result is unknown. */
    },
    deviceId: {
      name: 'device_id',
      type: 'varchar',
      length: 200,
      nullable: true,
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
    checkInScheduleId: {
      name: 'check_in_schedule_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
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
  },
  indices: [
    {
      name: 'IDX_CHECK_IN_RESPONSES_OFFICER_ID',
      columns: ['officerId'],
    },
    {
      name: 'IDX_CHECK_IN_RESPONSES_SCHEDULE_ID',
      columns: ['checkInScheduleId'],
    },
    {
      name: 'IDX_CHECK_IN_RESPONSES_OFFICER_RESPONDED_AT',
      columns: ['officerId', 'respondedAt'],
    },
    {
      name: 'IDX_CHECK_IN_RESPONSES_SCHEDULE_RESPONDED_AT',
      columns: ['checkInScheduleId', 'respondedAt'],
    },
  ],
});
