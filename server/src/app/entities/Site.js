import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Physical locations guarded. A client can have many sites.
 * Sites should be deactivated rather than deleted when historical attendance, shift, incident, or reporting records depend on them.
 */
export const Site = new EntitySchema({
  name: 'Site',
  tableName: 'sites',
  columns: {
    ...baseColumns,
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    address: {
      type: 'varchar',
      length: 255,
      nullable: false,
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
    geoFenceRadiusM: {
      name: 'geo_fence_radius_m',
      type: 'int',
      nullable: true,
    },
    timezone: {
      type: 'varchar',
      length: 100,
      nullable: false,
      default: 'Indian/Mauritius',
    },
    checkInIntervalMin: {
      name: 'check_in_interval_min',
      type: 'int',
      nullable: true,
    },
    checkInGraceMin: {
      name: 'check_in_grace_min',
      type: 'int',
      nullable: true,
    },
    isActive: {
      name: 'is_active',
      type: 'boolean',
      default: false,
      nullable: false,
    },
    clientId: {
      name: 'client_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    client: {
      type: 'many-to-one',
      target: 'Client',
      joinColumn: {
        name: 'client_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    attendanceEvents: {
      type: 'one-to-many',
      target: 'AttendanceEvent',
      inverseSide: 'site',
    },
    siteCheckpoints: {
      type: 'one-to-many',
      target: 'SiteCheckpoint',
      inverseSide: 'site',
    },
  },
  indices: [
    {
      name: 'IDX_SITES_CLIENT_ID',
      columns: ['clientId'],
    },
    {
      name: 'IDX_SITES_CLIENT_ACTIVE',
      columns: ['clientId', 'isActive'],
    },
  ],
  checks: [
    {
      name: 'CHK_SITES_LATITUDE',
      expression: '"latitude" BETWEEN -90 AND 90',
    },
    {
      name: 'CHK_SITES_LONGITUDE',
      expression: '"longitude" BETWEEN -180 AND 180',
    },
    {
      name: 'CHK_SITES_GEOFENCE_RADIUS',
      expression: '"geo_fence_radius_m" IS NULL OR "geo_fence_radius_m" > 0',
    },
    {
      name: 'CHK_SITES_CHECKIN_INTERVAL',
      expression: '"check_in_interval_min" IS NULL OR "check_in_interval_min" > 0',
    },
    {
      name: 'CHK_SITES_CHECKIN_GRACE',
      expression: '"check_in_grace_min" IS NULL OR "check_in_grace_min" >= 0',
    },
    {
      name: 'CHK_SITES_NAME_NOT_EMPTY',
      expression: 'length(trim(name)) > 0',
    },
    {
      name: 'CHK_SITES_ADDRESS_NOT_EMPTY',
      expression: 'length(trim(address)) > 0',
    },
    {
      name: 'CHK_SITES_TIMEZONE_NOT_EMPTY',
      expression: 'length(trim(timezone)) > 0',
    },
  ],
});
