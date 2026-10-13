import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Represents one employment period for an officer.
 *
 * Each rehire creates a new Employment record.
 * Previous employment records should be retained.
 */
export const Employment = new EntitySchema({
  name: 'Employment',
  tableName: 'employments',
  columns: {
    ...baseColumns,
    employeeCode: {
      name: 'employee_code',
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    hireDate: {
      name: 'hire_date',
      type: 'date',
      nullable: false,
    },
    terminationDate: {
      name: 'termination_date',
      type: 'date',
      nullable: true,
    },
    status: {
      name: 'status',
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'active',
      // active, on_leave, suspended, terminated
    },
    hourlyRate: {
      name: 'hourly_rate', 
      type: 'int', 
      /** 
      type: 'numeric',
      precision: 12,
      scale: 2,
      */
      nullable: true,
    },
    overtimeMultiplier: {
      name: 'overtime_multiplier', 
      type: 'int', 
      /** 
      type: 'numeric',
      precision: 5,
      scale: 2, 
      */
      nullable: true,
    },
    nightDiffMultiplier: {
      name: 'night_diff_multiplier', 
      type: 'int', 
      /** 
      type: 'numeric',
      precision: 5,
      scale: 2, 
      */
      nullable: true,
    },
    employmentType: {
      name: 'employment_type',
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'full_time',
      // full_time, part_time, temporary, contract
    },
    terminationReason: {
      name: 'termination_reason',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    notes: {
      name: 'notes',
      type: 'text',
      nullable: true,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      inverseSide: 'employments',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    }, 
    
    compensationHistory: {
      type: 'one-to-many',
      target: 'CompensationHistory',
      inverseSide: 'employment',
    }, 
    shifts: {
      type: 'one-to-many',
      target: 'Shift',
      inverseSide: 'employment',
    },
  },
  indices: [
    {
      name: 'UQ_EMPLOYMENTS_EMPLOYEE_CODE',
      columns: ['employeeCode'],
      unique: true,
    },
    {
      name: 'IDX_EMPLOYMENTS_OFFICER',
      columns: ['officerId'],
    },
    {
      name: 'IDX_EMPLOYMENTS_STATUS',
      columns: ['status'],
    },
    {
      name: 'IDX_EMPLOYMENTS_OFFICER_STATUS',
      columns: ['officerId', 'status'],
    },
    {
      name: 'IDX_EMPLOYMENTS_HIRE_DATE',
      columns: ['hireDate'],
    },
  ],
});