import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Historical compensation terms for an employment period.
 *
 * Create a new record whenever compensation terms change.
 * Do not overwrite historical rates.
 *
 * effectiveFrom is inclusive.
 * effectiveTo is exclusive; null means no scheduled end date.
 */
export const CompensationHistory = new EntitySchema({
  name: 'CompensationHistory',
  tableName: 'compensation_histories',
  columns: {
    ...baseColumns,
    effectiveFrom: {
      name: 'effective_from',
      type: 'date',
      nullable: false,
    },
    effectiveTo: {
      name: 'effective_to',
      type: 'date',
      nullable: true,
    },
    hourlyRate: {
      name: 'hourly_rate',
      type: 'int',
      /** 
      type: 'numeric',
      precision: 12,
      scale: 2, 
      */
      nullable: false,
    },
    overtimeMultiplier: {
      name: 'overtime_multiplier',
      type: 'int',
      /** 
      type: 'numeric',
      precision: 5,
      scale: 2, 
      */
      nullable: false,
      default: 15,
    },
    nightDiffMultiplier: {
      name: 'night_diff_multiplier',
      type: 'int',
      /** 
      type: 'numeric',
      precision: 5,
      scale: 2, 
      */
      nullable: false,
      default: 0,
      // Additional night differential multiplier.
      // Example: 15 (0.15) means an additional 15%.
    },
    currencyCode: {
      name: 'currency_code',
      type: 'varchar',
      length: 3,
      nullable: false,
      default: 'mur',
    },
    reason: {
      name: 'reason',
      type: 'varchar',
      length: 100,
      nullable: true,
      // e.g. initial_rate, annual_review, promotion, contract_change, correction
    },
    notes: {
      name: 'notes',
      type: 'text',
      nullable: true,
    },
    createdByUserId: {
      name: 'created_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    employmentId: {
      name: 'employment_id',
      type: 'uuid',
      nullable: false,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    employment: {
      type: 'many-to-one',
      target: 'Employment',
      inverseSide: 'compensationHistory',
      joinColumn: {
        name: 'employment_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    officer: {
      type: 'many-to-one',
      target: 'Officer',
      inverseSide: 'compensationHistory',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: false,
    },
    createdByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'created_by_user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'RESTRICT',
      nullable: true,
    },
  },
  indices: [
    {
      name: 'IDX_COMPENSATION_HISTORY_EMPLOYMENT',
      columns: ['employmentId'],
    },
    {
      name: 'IDX_COMPENSATION_HISTORY_EFFECTIVE_DATES',
      columns: ['employmentId', 'effectiveFrom', 'effectiveTo'],
    },
    {
      name: 'IDX_COMPENSATION_HISTORY_CREATED_BY',
      columns: ['createdByUserId'],
    },
  ],
});
