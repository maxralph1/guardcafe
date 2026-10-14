import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/**
 * Defines a user's membership and access level within a client company.
 *
 * A user may belong to multiple clients, and each client may have
 * multiple users.
 *
 * Access should be enforced by application authorization logic.
 */
export const ClientUser = new EntitySchema({
  name: 'ClientUser',
  tableName: 'client_users',
  columns: {
    ...baseColumns,
    clientId: {
      name: 'client_id',
      type: 'uuid',
      nullable: false,
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
    role: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'member',
      // owner, admin, site_manager, billing, member
    },
    status: {
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'active',
      // active, suspended, revoked
    },
    invitedByUserId: {
      name: 'invited_by_user_id',
      type: 'uuid',
      nullable: true,
    },
    invitedAt: {
      name: 'invited_at',
      type: 'timestamptz',
      nullable: true,
    },
    joinedAt: {
      name: 'joined_at',
      type: 'timestamptz',
      nullable: true,
    },
  },

  relations: {
    client: {
      type: 'many-to-one',
      target: 'Client',
      inverseSide: 'memberships',
      joinColumn: {
        name: 'client_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },

    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'clientMemberships',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },

    invitedBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'invited_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
  },

  indices: [
    {
      name: 'UQ_CLIENT_USERS_CLIENT_USER',
      columns: ['clientId', 'userId'],
      unique: true,
    },
    {
      name: 'IDX_CLIENT_USERS_USER_STATUS',
      columns: ['userId', 'status'],
    },
    {
      name: 'IDX_CLIENT_USERS_CLIENT_STATUS',
      columns: ['clientId', 'status'],
    },
    {
      name: 'IDX_CLIENT_USERS_INVITED_BY',
      columns: ['invitedByUserId'],
    },
  ],
});
