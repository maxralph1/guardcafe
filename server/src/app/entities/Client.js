import { EntitySchema } from 'typeorm'; 
import { baseColumns } from './baseColumns.js'; 
/** import { User } from './User.js'; */

/**
 * Companies that hire the security firm. 
 * Client records should generally be deactivated rather than deleted to preserve business and operational history.
 */
export const Client = new EntitySchema({
  name: 'Client', 
  tableName: 'clients', 
  columns: {
    ...baseColumns, 
    name: {
      name: 'name', 
      type: 'varchar', 
      length: 255,
      nullable: false,
    }, 
    contactPerson: {
      name: 'contact_person', 
      type: 'varchar', 
      length: 255, 
      nullable: false,
    }, 
    contactEmail: {
      name: 'contact_email', 
      type: 'varchar', 
      length: 255, 
      nullable: true,
    }, 
    contactPhone: {
      name: 'contact_phone', 
      type: 'varchar', 
      length: 50, 
      nullable: false,
    }, 
    billingAddress: {
      name: 'billing_address', 
      type: 'varchar', 
      length: 255, 
      nullable: false,
    }, 
    status: {
      name: 'status',
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'active',   // active, inactive
    }, 
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: true,
    }, 
  }, 
  relations: {
    /** 
    user: {
      type: 'one-to-one',
      target: 'User', 
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      nullable: false, 
      onDelete: 'RESTRICT',  
    }, 
    */ 
    memberships: {
      type: 'one-to-many',
      target: 'ClientUser',
      inverseSide: 'client',
    }, 
    clientActivities: {
      type: 'one-to-many',
      target: 'ClientActivity', 
      inverseSide: 'client',
    }, 
    sites: {
      type: 'one-to-many',
      target: 'Site', 
      inverseSide: 'client',
    }, 
  },
  indices: [
    {
      name: 'IDX_CLIENTS_USER_ID',
      columns: ['userId'],
      unique: true,
    }, 
    {
      name: 'IDX_CLIENTS_STATUS',
      columns: ['status'],
    },
  ],
});