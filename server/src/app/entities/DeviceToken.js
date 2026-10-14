import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';
/** import { User } from './User.js'; */

/**
 * Push notification tokens (FCM for Android, APNS for iOS) for user devices
 * Store an encrypted provider token for delivery and a keyed HMAC hash for lookup and deduplication.
 * Never expose token material through API responses or logs.
 */
export const DeviceToken = new EntitySchema({
  name: 'DeviceToken',
  tableName: 'device_tokens',
  columns: {
    ...baseColumns,
    tokenHash: {
      name: 'token_hash',
      type: 'text',
      nullable: false,
      /** HMAC-SHA-256 of the normalized provider token. Do not store the raw token in this field */
    },
    encryptedToken: {
      name: 'encrypted_token',
      type: 'text',
      nullable: false,
      select: false,
    },
    platform: {
      name: 'platform',
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'unknown', // web, ios, android
    },
    provider: {
      name: 'provider',
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    isActive: {
      name: 'is_active',
      type: 'boolean',
      default: false,
      nullable: false,
    },
    expiresAt: {
      name: 'expires_at',
      type: 'timestamptz',
      nullable: false,
    },
    lastUsedAt: {
      name: 'last_used_at',
      type: 'timestamptz',
      nullable: true,
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
      inverseSide: 'deviceTokens',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
      nullable: false,
    },
  },
  indices: [
    {
      name: 'IDX_DEVICE_TOKENS_TOKEN_HASH',
      columns: ['tokenHash'],
      unique: true,
    },
    {
      name: 'IDX_DEVICE_TOKENS_USER_ID',
      columns: ['userId'],
      unique: false,
    },
    {
      name: 'IDX_DEVICE_TOKENS_USER_ACTIVE',
      columns: ['userId', 'isActive'],
      unique: false,
    },
    {
      name: 'IDX_DEVICE_TOKENS_EXPIRATION',
      columns: ['expiresAt'],
      unique: false,
    },
  ],
});
