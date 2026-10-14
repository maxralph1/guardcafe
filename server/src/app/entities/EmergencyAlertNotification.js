import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';

/** Delivery jobs, retries, and delivery result. */
export const EmergencyAlertNotification = new EntitySchema({
  name: 'EmergencyAlertNotification',
  tableName: 'emergency_alert_notifications',
  columns: {
    ...baseColumns,
    /** Notification destination. */
    recipientType: {
      name: 'recipient_type',
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    /** The destination identifier, such as a user ID, phone number, email address, or provider-specific destination reference. Avoid storing unnecessary personal data here. */
    recipientReference: {
      name: 'recipient_reference',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    /** push, sms, email, voice, or another supported channel. */
    channel: {
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    /** Application/provider identifier, e.g. fcm, apns, twilio. */
    provider: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    /** queued, processing, sent, delivered, failed, cancelled. */
    status: {
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'queued',
    },
    /** Number of attempts made for this notification job. */
    attemptCount: {
      name: 'attempt_count',
      type: 'integer',
      nullable: false,
      default: 0,
    },
    /** Maximum number of attempts permitted for this job. */
    maxAttempts: {
      name: 'max_attempts',
      type: 'integer',
      nullable: false,
      default: 5,
    },
    queuedAt: {
      name: 'queued_at',
      type: 'timestamptz',
      createDate: true,
      nullable: false,
    },
    nextAttemptAt: {
      name: 'next_attempt_at',
      type: 'timestamptz',
      nullable: true,
    },
    processingStartedAt: {
      name: 'processing_started_at',
      type: 'timestamptz',
      nullable: true,
    },
    sentAt: {
      name: 'sent_at',
      type: 'timestamptz',
      nullable: true,
    },
    deliveredAt: {
      name: 'delivered_at',
      type: 'timestamptz',
      nullable: true,
    },
    failedAt: {
      name: 'failed_at',
      type: 'timestamptz',
      nullable: true,
    },
    cancelledAt: {
      name: 'cancelled_at',
      type: 'timestamptz',
      nullable: true,
    },
    /** Provider message identifier, when available. */
    providerMessageId: {
      name: 'provider_message_id',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    /** Short, sanitized error information. Never store credentials, authentication tokens, or sensitive provider payloads. */
    lastErrorCode: {
      name: 'last_error_code',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    lastErrorMessage: {
      name: 'last_error_message',
      type: 'text',
      nullable: true,
    },
    /** Optional reference for correlating logs and delivery workflows. */
    correlationId: {
      name: 'correlation_id',
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    emergencyAlertId: {
      name: 'emergency_alert_id',
      type: 'uuid',
      nullable: false,
    },
    /** Optional: which responder assignment this notification concerns. */
    emergencyAlertResponderId: {
      name: 'emergency_alert_responder_id',
      type: 'uuid',
      nullable: true,
    },
  },

  relations: {
    emergencyAlert: {
      type: 'many-to-one',
      target: 'EmergencyAlert',
      inverseSide: 'notifications',
      joinColumn: {
        name: 'emergency_alert_id',
        referencedColumnName: 'id',
      },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    emergencyAlertResponder: {
      type: 'many-to-one',
      target: 'EmergencyAlertResponder',
      inverseSide: 'notifications',
      joinColumn: {
        name: 'emergency_alert_responder_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
  },

  indices: [
    {
      name: 'IDX_EA_NOTIFICATIONS_ALERT_STATUS',
      columns: ['emergencyAlertId', 'status'],
    },
    {
      name: 'IDX_EA_NOTIFICATIONS_STATUS_NEXT_ATTEMPT',
      columns: ['status', 'nextAttemptAt'],
    },
    {
      name: 'IDX_EA_NOTIFICATIONS_RESPONDER',
      columns: ['emergencyAlertResponderId'],
    },
    {
      name: 'IDX_EA_NOTIFICATIONS_PROVIDER_MESSAGE',
      columns: ['provider', 'providerMessageId'],
    },
    {
      name: 'IDX_EA_NOTIFICATIONS_CREATED_AT',
      columns: ['createdAt'],
    },
  ],
});
