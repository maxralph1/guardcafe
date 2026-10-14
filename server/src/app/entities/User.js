import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    ...baseColumns,
    username: {
      type: 'varchar',
      length: 255,
      // unique: true,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
      select: false,
    },
    firstName: {
      name: 'first_name',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    otherNames: {
      name: 'other_names',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    lastName: {
      name: 'last_name',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    organizationName: {
      name: 'organization_name', // for organizations only
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    profilePhotoUrl: {
      name: 'profile_photo_url',
      type: 'text',
      nullable: true,
    },
    phone: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    isOnline: {
      name: 'is_online',
      type: 'boolean',
      default: true,
      nullable: false,
    },
    lastActivity: {
      name: 'last_activity',
      type: 'timestamptz',
      nullable: true,
    },
    role: {
      type: 'varchar',
      length: 50,
      default: 'user', // user, officer, staff, driver, police, secretary, supervisor, admin, multiple
      nullable: false,
    },
  },
  relations: {
    clientMemberships: {
      type: 'one-to-many',
      target: 'ClientUser',
      inverseSide: 'user',
    },
    deviceTokens: {
      type: 'one-to-many',
      target: 'DeviceToken', // string form avoids the circular import
      inverseSide: 'user',
    },
    incidentNotifications: {
      type: 'one-to-many',
      target: 'IncidentNotification',
      inverseSide: 'user',
    },
    notifications: {
      type: 'one-to-many',
      target: 'Notification',
      inverseSide: 'user',
    },
    officers: {
      type: 'one-to-many',
      target: 'Officer', // string form avoids the circular import
      inverseSide: 'user',
    },
    uploadedStaffPaymentTransactionAttachments: {
      type: 'one-to-many',
      target: 'StaffPaymentTransactionAttachment',
      inverseSide: 'uploadedByUser',
    },
    reviewedStaffPaymentTransactionAttachments: {
      type: 'one-to-many',
      target: 'StaffPaymentTransactionAttachment',
      inverseSide: 'reviewedByUser',
    },
    refreshTokens: {
      type: 'one-to-many',
      target: 'RefreshToken', // string form avoids the circular import
      inverseSide: 'user',
    },
  },
  indices: [
    {
      name: 'IDX_USERS_USERNAME',
      columns: ['username'],
      unique: true,
    },
  ],
});
