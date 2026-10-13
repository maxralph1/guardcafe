import { EntitySchema } from 'typeorm';

/**
 * JWT Refresh Tokens
 */
export const RefreshToken = new EntitySchema({
  name: 'RefreshToken',
  tableName: 'refresh_tokens',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: true,
    },
    tokenHash: {
      name: 'token_hash',
      type: 'text',
      nullable: false,
    },
    deviceInfo: {
      name: 'device_info',
      type: 'jsonb',
      nullable: false,
    },
    ipAddress: {
      name: 'ip_address',
      type: 'inet',
      nullable: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    expiresAt: {
      name: 'expires_at',
      type: 'timestamptz',
      nullable: false,
    },
    revokedAt: {
      name: 'revoked_at',
      type: 'timestamptz',
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
      type: 'many-to-one',
      target: 'User', 
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      nullable: false, 
      onDelete: 'RESTRICT', 
    },
  },
  indices: [
    {
      name: 'IDX_REFRESHTOKENS_TOKEN_HASH',
      columns: ['tokenHash'],
      unique: true,
    },
    {
      name: 'IDX_REFRESHTOKENS_USER_ID',
      columns: ['userId'],
      unique: false,
    },
  ],
});