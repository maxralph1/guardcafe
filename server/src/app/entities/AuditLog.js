import { EntitySchema } from 'typeorm'; 
/** import { User } from './User.js'; */

/**
 * Every sensitive action. Critical for security company. 
 * Records security-sensitive actions performed by users or syst3m processes. 
 * Audit records should be append-only. Corrections should be recorded as additional Audit events rather than modifying historical records. 
 */
export const AuditLog = new EntitySchema({
  name: 'AuditLog', 
  tableName: 'audit_logs', 
  columns: {
    id: {
      type: 'uuid', 
      primary: true, 
      generated: 'uuid', 
    }, 
    action: {
      type: 'varchar', 
      length: 100, 
      nullable: false, 
      /** e.g. officer_terminated, payroll_approved, etc */
    }, 
    entityType: {
      name: 'entity_type', 
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      /** e.g. officer, shift, etc */
    }, 
    entityId: {
      name: 'entity_id',
      type: 'uuid',
      nullable: false,
    }, 
    beforeState: {
      name: 'before_state', 
      type: 'jsonb', 
      nullable: true, 
    }, 
    afterState: {
      name: 'after_state', 
      type: 'jsonb', 
      nullable: true, 
    }, 
    ipAddress: {
      name: 'ip_address',
      type: 'inet',
      nullable: true,
    }, 
    userAgent: {
      name: 'user_agent', 
      type: 'text', 
      nullable: true, 
    }, 
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
      nullable: false,
    },
    actorUserId: {
      name: 'actor_user_id',
      type: 'uuid',
      nullable: true,   // as some may be system actions
    }, 
  }, 
  relations: {
    actorUser: {
      type: 'many-to-one',
      target: 'User', 
      joinColumn: {
        name: 'actor_user_id',
        referencedColumnName: 'id',
      },
      inverseSide: 'auditLogs', 
      nullable: true, 
      onDelete: 'RESTRICT',
    }, 
  }, 
  indices: [
    {
      name: 'IDX_AUDIT_LOGS_ACTOR_USER_ID', 
      unique: false, 
      columns: ['actorUserId'],
    }, 
    {
      name: 'IDX_AUDIT_LOGS_ACTOR_CREATED_AT',
      columns: ['actorUserId', 'createdAt'],
    },
    {
      name: 'IDX_AUDIT_LOGS_ENTITY',
      columns: ['entityType', 'entityId'],
    },
    {
      name: 'IDX_AUDIT_LOGS_ACTION_CREATED_AT',
      columns: ['action', 'createdAt'],
    },
    {
      name: 'IDX_AUDIT_LOGS_IP_ADDRESS',
      columns: ['ipAddress'],
    },
  ],
});