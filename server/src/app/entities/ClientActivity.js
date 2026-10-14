import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';
/** import { Client } from './Client.js'; */

/**
 * Records contract-related activities for a client.
 * Examples:
 * contract_started, contract_renewed, contract_suspended, contract_resumed, contract_expired, contract_terminated.
 * Preserve these records for contract history, billing, compliance and investigations.
 */
export const ClientActivity = new EntitySchema({
  name: 'ClientActivity',
  tableName: 'client_activities',
  columns: {
    ...baseColumns,
    type: {
      name: 'type',
      type: 'varchar',
      length: 50,
      default: 'active', // contract_resumption, contract_elapse
    },
    contractStartDate: {
      name: 'contract_start_date',
      type: 'timestamptz',
      nullable: false,
    },
    contractEndDate: {
      name: 'contract_end_date',
      type: 'timestamptz',
      nullable: true,
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
      nullable: false,
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'IDX_CLIENT_ACTIVITIES_CLIENT_ID',
      columns: ['clientId'],
      unique: false,
    },
    {
      name: 'IDX_CLIEMT_ACTIVITIES_CLIENT_OCCURRED_AT',
      columns: ['clientId', 'createdAt'],
      unique: false,
    },
    {
      name: 'IDX_CLIENT_ACTIVITIES_TYPE',
      columns: ['type'],
      unique: false,
    },
  ],
});
