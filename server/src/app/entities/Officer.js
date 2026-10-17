import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Represents an individual security officer.
 * Employment periods are stored separately in Employment.
 * A person can have multiple employment records over time.
 * Every officer is a User: the login account holds their name, email and phone,
 * and one User can only ever be one Officer.
 */
export const Officer = new EntitySchema({
  name: 'Officer',
  tableName: 'officers',
  columns: {
    ...baseColumns,
    bloodType: {
      name: 'blood_type',
      type: 'varchar',
      length: 10,
      nullable: true,
    },
    emergencyContactName: {
      name: 'emergency_contact_name',
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    emergencyContactPhone: {
      name: 'emergency_contact_phone',
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    notes: {
      name: 'notes',
      type: 'text',
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
      type: 'one-to-one',
      target: 'User',
      inverseSide: 'officer',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    compensationHistory: {
      type: 'one-to-many',
      target: 'CompensationHistory',
      inverseSide: 'officer',
    },
    employments: {
      type: 'one-to-many',
      target: 'Employment',
      inverseSide: 'officer',
    },
    attendanceEvents: {
      type: 'one-to-many',
      target: 'AttendanceEvent',
      inverseSide: 'officer',
    },
    officerActivities: {
      type: 'one-to-many',
      target: 'OfficerActivity',
      inverseSide: 'officer',
    },
    officerCredentials: {
      type: 'one-to-many',
      target: 'OfficerCredential',
      inverseSide: 'officer',
    },
    officerDocuments: {
      type: 'one-to-many',
      target: 'OfficerDocument',
      inverseSide: 'officer',
    },
    shifts: {
      type: 'one-to-many',
      target: 'Shift',
      inverseSide: 'officer',
    },
    checkInSchedules: {
      type: 'one-to-many',
      target: 'CheckInSchedule',
      inverseSide: 'officer',
    },
    checkInResponses: {
      type: 'one-to-many',
      target: 'CheckInResponse',
      inverseSide: 'officer',
    },
    siteCheckpointPatrols: {
      type: 'one-to-many',
      target: 'SiteCheckpointPatrol',
      inverseSide: 'officer',
    },
    staffPayments: {
      type: 'one-to-many',
      target: 'StaffPayment',
      inverseSide: 'officer',
    },
    staffPaymentTransactions: {
      type: 'one-to-many',
      target: 'StaffPaymentTransaction',
      inverseSide: 'officer',
    },
  },
});
