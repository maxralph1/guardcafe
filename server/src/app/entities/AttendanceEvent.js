import { EntitySchema } from 'typeorm';
/** 
import { Officer } from './Officer.js'; 
import { Site } from './Site.js'; 
import { Shift } from './Shift.js'; 
*/

/**
 * Every clock-in/clock-out attempt.
 * Immutable audit log.
 * This is legal evidence table. Never update rows here -- only insert.
 * Correction should be inserted as new event.
 */
export const AttendanceEvent = new EntitySchema({
  name: 'AttendanceEvent',
  tableName: 'attendance_events',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    type: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'clock_in', // clock_in, clock_out, break_start, break_end
    },
    eventTime: {
      name: 'event_time',
      type: 'timestamptz',
      nullable: false,
      /** server time */
    },
    deviceTime: {
      name: 'device_time',
      type: 'timestamptz',
      nullable: false,
      /** client time (detect tampering) */
    },
    latitude: {
      type: 'numeric',
      precision: 10,
      scale: 7,
      nullable: false,
    },
    longitude: {
      type: 'numeric',
      precision: 10,
      scale: 7,
      nullable: false,
    },
    accuracyM: {
      name: 'accuracy_m',
      type: 'numeric',
      precision: 6,
      scale: 2,
      nullable: false,
      /** GPS accuracy */
    },
    distanceFromSiteM: {
      name: 'distance_from_site_m',
      type: 'numeric',
      precision: 8,
      scale: 2,
      nullable: false,
      /** computed server-side */
    },
    withinGeoFence: {
      name: 'within_geo_fence',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    biometricType: {
      name: 'biometric_type',
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'none', // fingerprint, face, none
    },
    biometricMethod: {
      name: 'biometric_method',
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'none', // biometeic_prompt, fingerprint, face_id, none
    },
    biometricSuccess: {
      name: 'biometric_success',
      type: 'boolean',
      nullable: false,
      default: false,
      /** result only, never raw data */
    },
    deviceId: {
      name: 'device_id',
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    ipAddress: {
      name: 'ip_address',
      type: 'inet',
      nullable: false,
    },
    photoUrl: {
      name: 'photo_url',
      type: 'text',
      nullable: true,
      /** optional selfie at clock-in */
    },
    isFlagged: {
      name: 'is_flagged',
      type: 'boolean',
      nullable: false,
      default: false,
      /** auto-flag if outside fence */
    },
    flagReason: {
      name: 'flag_reason',
      type: 'varchar',
      length: 255,
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
  },
  relations: {
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      inverseSide: 'attendanceEvents',
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
      inverseSide: 'attendanceEvents',
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
      inverseSide: 'attendanceEvents',
      nullable: false,
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'IDX_ATTENDANCE_EVENTS_LATITUDE_LONGITUDE',
      columns: ['latitude', 'longitude'],
      unique: false,
    },
    {
      name: 'IDX_ATTENDANCE_EVENTS_OFFICER_ID',
      columns: ['officerId'],
      unique: false,
    },
    {
      name: 'IDX_ATTENDANCE_EVENTS_SHIFT_ID',
      columns: ['shiftId'],
      unique: false,
    },
    {
      name: 'IDX_ATTENDANCE_EVENTS_SITE_ID',
      columns: ['siteId'],
      unique: false,
    },
  ],
});
