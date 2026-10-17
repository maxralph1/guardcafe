/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class InitialSchema1792184635625 {
  name = 'InitialSchema1792184635625';

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "attendance_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(50) NOT NULL DEFAULT 'clock_in', "event_time" TIMESTAMP WITH TIME ZONE NOT NULL, "device_time" TIMESTAMP WITH TIME ZONE NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "accuracy_m" numeric(6,2) NOT NULL, "distance_from_site_m" numeric(8,2) NOT NULL, "within_geo_fence" boolean NOT NULL DEFAULT false, "biometric_type" character varying(50) NOT NULL DEFAULT 'none', "biometric_method" character varying(50) NOT NULL DEFAULT 'none', "biometric_success" boolean NOT NULL DEFAULT false, "device_id" character varying(200) NOT NULL, "ip_address" inet NOT NULL, "photo_url" text, "is_flagged" boolean NOT NULL DEFAULT false, "flag_reason" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "officer_id" uuid NOT NULL, "shift_id" uuid NOT NULL, "site_id" uuid NOT NULL, CONSTRAINT "PK_8d7140035888f869932307395ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ATTENDANCE_EVENTS_LATITUDE_LONGITUDE" ON "attendance_events"  ("latitude", "longitude") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ATTENDANCE_EVENTS_OFFICER_ID" ON "attendance_events"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ATTENDANCE_EVENTS_SHIFT_ID" ON "attendance_events"  ("shift_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ATTENDANCE_EVENTS_SITE_ID" ON "attendance_events"  ("site_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying(100) NOT NULL, "entity_type" character varying(50) NOT NULL, "entity_id" uuid NOT NULL, "before_state" jsonb, "after_state" jsonb, "ip_address" inet, "user_agent" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "actor_user_id" uuid, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_LOGS_ACTOR_USER_ID" ON "audit_logs"  ("actor_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_LOGS_ACTOR_CREATED_AT" ON "audit_logs"  ("actor_user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_LOGS_ENTITY" ON "audit_logs"  ("entity_type", "entity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_LOGS_ACTION_CREATED_AT" ON "audit_logs"  ("action", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_LOGS_IP_ADDRESS" ON "audit_logs"  ("ip_address") `,
    );
    await queryRunner.query(
      `CREATE TABLE "call_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "caller_id" uuid, "callee_id" uuid, "call_type" character varying(50) NOT NULL DEFAULT 'audio', "initiated_by" character varying(50) NOT NULL DEFAULT 'caller', "initiated_by_user_id" uuid, "status" character varying(50) NOT NULL DEFAULT 'ringing', "started_at" TIMESTAMP WITH TIME ZONE, "answered_at" TIMESTAMP WITH TIME ZONE, "ended_at" TIMESTAMP WITH TIME ZONE, "emergency_alert_id" uuid, "check_in_schedule_id" uuid, CONSTRAINT "PK_43019a4ddb87c365c3d13fbe9e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CALL_SESSIONS_CALLER_ID" ON "call_sessions"  ("caller_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CALL_SESSIONS_CALLEE_ID" ON "call_sessions"  ("callee_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CALL_SESSIONS_INITIATED_BY_USER_ID" ON "call_sessions"  ("initiated_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CALL_SESSIONS_EMERGENCY_ALERT_ID" ON "call_sessions"  ("emergency_alert_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CALL_SESSIONS_CHECK_IN_SCHEDULE_ID" ON "call_sessions"  ("check_in_schedule_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CALL_SESSIONS_STATUS_CREATED_AT" ON "call_sessions"  ("status", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "check_in_alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alert_level" character varying(50) NOT NULL DEFAULT 'warning', "alerted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "acknowledged_by" uuid, "acknowledged_at" TIMESTAMP WITH TIME ZONE, "resolved_at" TIMESTAMP WITH TIME ZONE, "resolution_notes" text, "check_in_schedule_id" uuid NOT NULL, "officer_id" uuid NOT NULL, "site_id" uuid NOT NULL, CONSTRAINT "PK_96bd5d4e42d6e827da442d147e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_ALERTS_SCHEDULE_ID" ON "check_in_alerts"  ("check_in_schedule_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_ALERTS_OFFICER_ID" ON "check_in_alerts"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_ALERTS_SITE_ID" ON "check_in_alerts"  ("site_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_ALERTS_LEVEL_ALERTED_AT" ON "check_in_alerts"  ("alert_level", "alerted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_ALERTS_ACKNOWLEDGED_BY" ON "check_in_alerts"  ("acknowledged_by") `,
    );
    await queryRunner.query(
      `CREATE TABLE "check_in_responses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "responded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "response" character varying(50) NOT NULL DEFAULT 'alert', "latitude" numeric(10,7), "longitude" numeric(10,7), "within_geo_fence" boolean, "device_id" character varying(200), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "officer_id" uuid NOT NULL, "check_in_schedule_id" uuid NOT NULL, CONSTRAINT "PK_1825b91601ce980964a40e2516c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_RESPONSES_OFFICER_ID" ON "check_in_responses"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_RESPONSES_SCHEDULE_ID" ON "check_in_responses"  ("check_in_schedule_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_RESPONSES_OFFICER_RESPONDED_AT" ON "check_in_responses"  ("officer_id", "responded_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_RESPONSES_SCHEDULE_RESPONDED_AT" ON "check_in_responses"  ("check_in_schedule_id", "responded_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "check_in_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL, "grace_until" TIMESTAMP WITH TIME ZONE NOT NULL, "event_time" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "officer_id" uuid NOT NULL, "shift_id" uuid NOT NULL, "site_id" uuid NOT NULL, CONSTRAINT "PK_9b436ae1dc077d74928531e1449" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_SCHEDULES_OFFICER_ID" ON "check_in_schedules"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_SCHEDULES_SHIFT_ID" ON "check_in_schedules"  ("shift_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_SCHEDULES_SITE_ID" ON "check_in_schedules"  ("site_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_SCHEDULES_STATUS_GRACE_UNTIL" ON "check_in_schedules"  ("status", "grace_until") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHECK_IN_SCHEDULES_OFFICER_SCHEDULED_AT" ON "check_in_schedules"  ("officer_id", "scheduled_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "contact_person" character varying(255) NOT NULL, "contact_email" character varying(255), "contact_phone" character varying(50) NOT NULL, "billing_address" character varying(255) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'active', "user_id" uuid, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CLIENTS_USER_ID" ON "clients"  ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_CLIENTS_STATUS" ON "clients"  ("status") `);
    await queryRunner.query(
      `CREATE TABLE "client_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" character varying(50) NOT NULL DEFAULT 'active', "contract_start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "contract_end_date" TIMESTAMP WITH TIME ZONE, "client_id" uuid NOT NULL, CONSTRAINT "PK_1c91d7ed732529e6c55388cb70c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CLIENT_ACTIVITIES_CLIENT_ID" ON "client_activities"  ("client_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CLIENT_ACTIVITIES_CLIENT_OCCURRED_AT" ON "client_activities"  ("client_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CLIENT_ACTIVITIES_TYPE" ON "client_activities"  ("type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "client_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "client_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" character varying(50) NOT NULL DEFAULT 'member', "status" character varying(50) NOT NULL DEFAULT 'active', "invited_by_user_id" uuid, "invited_at" TIMESTAMP WITH TIME ZONE, "joined_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fe74bfd4d01077395ee4204b553" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_CLIENT_USERS_CLIENT_USER" ON "client_users"  ("client_id", "user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CLIENT_USERS_USER_STATUS" ON "client_users"  ("user_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CLIENT_USERS_CLIENT_STATUS" ON "client_users"  ("client_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CLIENT_USERS_INVITED_BY" ON "client_users"  ("invited_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "compensation_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "effective_from" date NOT NULL, "effective_to" date, "hourly_rate" integer NOT NULL, "overtime_multiplier" numeric(5,2) NOT NULL DEFAULT '1.5', "night_diff_multiplier" numeric(5,2) NOT NULL DEFAULT '0', "currency_code" character varying(3) NOT NULL DEFAULT 'mur', "reason" character varying(100), "notes" text, "created_by_user_id" uuid, "employment_id" uuid NOT NULL, "officer_id" uuid NOT NULL, CONSTRAINT "PK_859bd56457909d5a0d56f4cacd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_COMPENSATION_HISTORY_EMPLOYMENT" ON "compensation_histories"  ("employment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_COMPENSATION_HISTORY_EFFECTIVE_DATES" ON "compensation_histories"  ("employment_id", "effective_from", "effective_to") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_COMPENSATION_HISTORY_CREATED_BY" ON "compensation_histories"  ("created_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "device_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "token_hash" text NOT NULL, "encrypted_token" text NOT NULL, "platform" character varying(50) NOT NULL DEFAULT 'unknown', "provider" character varying(20) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "last_used_at" TIMESTAMP WITH TIME ZONE, "revoked_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_84700be257607cfb1f9dc2e52c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_DEVICE_TOKENS_TOKEN_HASH" ON "device_tokens"  ("token_hash") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_DEVICE_TOKENS_USER_ID" ON "device_tokens"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_DEVICE_TOKENS_USER_ACTIVE" ON "device_tokens"  ("user_id", "is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_DEVICE_TOKENS_EXPIRATION" ON "device_tokens"  ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "emergency_alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "triggered_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "latitude" numeric(10,7), "longitude" numeric(10,7), "accuracy_m" numeric(8,2), "status" character varying(50) NOT NULL DEFAULT 'active', "severity" character varying(50) NOT NULL DEFAULT 'high', "acknowledged_by" uuid, "acknowledged_at" TIMESTAMP WITH TIME ZONE, "resolved_by" uuid, "resolved_at" TIMESTAMP WITH TIME ZONE, "resolution_notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "officer_id" uuid NOT NULL, "shift_id" uuid NOT NULL, "site_id" uuid NOT NULL, "check_in_schedule_id" uuid, CONSTRAINT "PK_c0a1cae4572ece44529b12f4583" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_STATUS_TRIGGERED" ON "emergency_alerts"  ("status", "triggered_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_SEVERITY_STATUS" ON "emergency_alerts"  ("severity", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_OFFICER_TRIGGERED" ON "emergency_alerts"  ("officer_id", "triggered_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_SHIFT_ID" ON "emergency_alerts"  ("shift_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_SITE_STATUS" ON "emergency_alerts"  ("site_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_ACKNOWLEDGED_BY" ON "emergency_alerts"  ("acknowledged_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_RESOLVED_BY" ON "emergency_alerts"  ("resolved_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMERGENCY_ALERTS_CHECK_IN_SCHEDULE_ID" ON "emergency_alerts"  ("check_in_schedule_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "emergency_alert_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_type" character varying(100) NOT NULL, "description" text, "previous_status" character varying(50), "new_status" character varying(50), "metadata" jsonb, "correlation_id" character varying(100), "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "emergency_alert_id" uuid NOT NULL, "actor_user_id" uuid, CONSTRAINT "PK_787211dc86b1ec2dcca753f27b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_EVENTS_ALERT_OCCURRED" ON "emergency_alert_events"  ("emergency_alert_id", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_EVENTS_TYPE_OCCURRED" ON "emergency_alert_events"  ("event_type", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_EVENTS_ACTOR_OCCURRED" ON "emergency_alert_events"  ("actor_user_id", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_EVENTS_CORRELATION" ON "emergency_alert_events"  ("correlation_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "emergency_alert_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "recipient_type" character varying(30) NOT NULL, "recipient_reference" character varying(255), "channel" character varying(30) NOT NULL, "provider" character varying(50), "status" character varying(30) NOT NULL DEFAULT 'queued', "attempt_count" integer NOT NULL DEFAULT '0', "max_attempts" integer NOT NULL DEFAULT '5', "queued_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "next_attempt_at" TIMESTAMP WITH TIME ZONE, "processing_started_at" TIMESTAMP WITH TIME ZONE, "sent_at" TIMESTAMP WITH TIME ZONE, "delivered_at" TIMESTAMP WITH TIME ZONE, "failed_at" TIMESTAMP WITH TIME ZONE, "cancelled_at" TIMESTAMP WITH TIME ZONE, "provider_message_id" character varying(255), "last_error_code" character varying(100), "last_error_message" text, "correlation_id" character varying(100), "emergency_alert_id" uuid NOT NULL, "emergency_alert_responder_id" uuid, CONSTRAINT "PK_f2a89515388670bc4a9935f3431" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_NOTIFICATIONS_ALERT_STATUS" ON "emergency_alert_notifications"  ("emergency_alert_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_NOTIFICATIONS_STATUS_NEXT_ATTEMPT" ON "emergency_alert_notifications"  ("status", "next_attempt_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_NOTIFICATIONS_RESPONDER" ON "emergency_alert_notifications"  ("emergency_alert_responder_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_NOTIFICATIONS_PROVIDER_MESSAGE" ON "emergency_alert_notifications"  ("provider", "provider_message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_NOTIFICATIONS_CREATED_AT" ON "emergency_alert_notifications"  ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "emergency_alert_responders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_contact" character varying(200), "role" character varying(100), "status" character varying(50) NOT NULL DEFAULT 'pending', "notified_at" TIMESTAMP WITH TIME ZONE, "acknowledged_at" TIMESTAMP WITH TIME ZONE, "responded_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "notes" text, "emergency_alert_id" uuid NOT NULL, "user_id" uuid, CONSTRAINT "PK_6bbf4a5a1c84162c3ef42a8cefa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_RESPONDERS_ALERT_STATUS" ON "emergency_alert_responders"  ("emergency_alert_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_RESPONDERS_USER_ID" ON "emergency_alert_responders"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EA_RESPONDERS_STATUS_NOTIFIED" ON "emergency_alert_responders"  ("status", "notified_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "employments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "employee_code" character varying(50) NOT NULL, "hire_date" date NOT NULL, "termination_date" date, "status" character varying(30) NOT NULL DEFAULT 'active', "hourly_rate" integer, "overtime_multiplier" numeric(5,2), "night_diff_multiplier" numeric(5,2), "employment_type" character varying(30) NOT NULL DEFAULT 'full_time', "termination_reason" character varying(100), "notes" text, "officer_id" uuid NOT NULL, CONSTRAINT "PK_208f1abe9b236e156e33f9eeb58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_EMPLOYMENTS_EMPLOYEE_CODE" ON "employments"  ("employee_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMPLOYMENTS_OFFICER" ON "employments"  ("officer_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_EMPLOYMENTS_STATUS" ON "employments"  ("status") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_EMPLOYMENTS_OFFICER_STATUS" ON "employments"  ("officer_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EMPLOYMENTS_HIRE_DATE" ON "employments"  ("hire_date") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incidents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "incident_number" character varying(50), "incident_type" character varying(50) NOT NULL DEFAULT 'suspicious_activity', "severity" character varying(50) NOT NULL DEFAULT 'high', "title" character varying(200) NOT NULL, "description" text, "occurred_at" TIMESTAMP WITH TIME ZONE, "latitude" numeric(10,7), "longitude" numeric(10,7), "location_description" character varying(255), "status" character varying(50) NOT NULL DEFAULT 'draft', "review_outcome" character varying(50), "reviewed_by" uuid, "reviewed_at" TIMESTAMP WITH TIME ZONE, "closed_at" TIMESTAMP WITH TIME ZONE, "officer_id" uuid NOT NULL, "shift_id" uuid, "site_id" uuid NOT NULL, "emergency_alert_id" uuid, CONSTRAINT "PK_ccb34c01719889017e2246469f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_INCIDENTS_INCIDENT_NUMBER" ON "incidents"  ("incident_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENTS_STATUS_OCCURRED" ON "incidents"  ("status", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENTS_TYPE_OCCURRED" ON "incidents"  ("incident_type", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENTS_SEVERITY_STATUS" ON "incidents"  ("severity", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENTS_OFFICER_ID" ON "incidents"  ("officer_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_INCIDENTS_SHIFT_ID" ON "incidents"  ("shift_id") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENTS_SITE_OCCURRED" ON "incidents"  ("site_id", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENTS_REVIEWED_BY" ON "incidents"  ("reviewed_by") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "file_type" character varying(50) NOT NULL, "file_name" character varying(255), "mime_type" character varying(150), "file_size_bytes" bigint, "storage_key" character varying(1024), "sha256_hash" character varying(64), "is_evidence" boolean NOT NULL DEFAULT false, "evidence_status" character varying(30), "collected_at" TIMESTAMP WITH TIME ZONE, "captured_at" TIMESTAMP WITH TIME ZONE, "collection_location" character varying(255), "latitude" numeric(10,7), "longitude" numeric(10,7), "source_type" character varying(50), "source_reference" character varying(255), "uploaded_by" uuid NOT NULL, "reviewed_by_user_id" uuid, "reviewed_at" TIMESTAMP WITH TIME ZONE, "review_notes" text, "incident_id" uuid NOT NULL, CONSTRAINT "PK_c4cdf0dc167f160d5a997fbbbd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_ATTACHMENTS_INCIDENT" ON "incident_attachments"  ("incident_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_ATTACHMENTS_UPLOADED_BY" ON "incident_attachments"  ("uploaded_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_ATTACHMENTS_EVIDENCE_STATUS" ON "incident_attachments"  ("is_evidence", "evidence_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_ATTACHMENTS_REVIEWED_BY" ON "incident_attachments"  ("reviewed_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_ATTACHMENTS_COLLECTED_AT" ON "incident_attachments"  ("collected_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_type" character varying(100) NOT NULL, "description" text, "previous_status" character varying(50), "new_status" character varying(50), "previous_severity" character varying(50), "new_severity" character varying(50), "metadata" jsonb, "correlation_id" character varying(100), "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "incident_id" uuid NOT NULL, "actor_user_id" uuid, CONSTRAINT "PK_1230e0a50df3503eed115634297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_EVENTS_INCIDENT_OCCURRED" ON "incident_events"  ("incident_id", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_EVENTS_TYPE_OCCURRED" ON "incident_events"  ("event_type", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_EVENTS_ACTOR_OCCURRED" ON "incident_events"  ("actor_user_id", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_EVENTS_CORRELATION" ON "incident_events"  ("correlation_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incident_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "method" character varying(50) NOT NULL DEFAULT 'push', "status" character varying(30) NOT NULL DEFAULT 'pending', "external_contact" character varying(200), "notified_at" TIMESTAMP WITH TIME ZONE, "notified_user_id" uuid, "delivered_at" TIMESTAMP WITH TIME ZONE, "failed_at" TIMESTAMP WITH TIME ZONE, "failure_reason" text, "incident_id" uuid NOT NULL, CONSTRAINT "CHK_INCIDENT_NOTIFICATIONS_RECIPIENT" CHECK ("notified_user_id" IS NOT NULL OR "external_contact" IS NOT NULL), CONSTRAINT "PK_48597d225b5e03870aa30afc4d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_NOTIFICATIONS_INCIDENT" ON "incident_notifications"  ("incident_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_NOTIFICATIONS_USER" ON "incident_notifications"  ("notified_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_NOTIFICATIONS_STATUS" ON "incident_notifications"  ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INCIDENT_NOTIFICATIONS_INCIDENT_STATUS" ON "incident_notifications"  ("incident_id", "status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" character varying(50) NOT NULL, "title" character varying(200) NOT NULL, "body" text, "payload" jsonb, "is_read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_NOTIFICATIONS_USER_ID" ON "notifications"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_NOTIFICATIONS_USER_CREATED" ON "notifications"  ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_NOTIFICATIONS_TYPE_CREATED" ON "notifications"  ("type", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "officers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "blood_type" character varying(10), "emergency_contact_name" character varying(150), "emergency_contact_phone" character varying(50), "notes" text, "user_id" uuid NOT NULL, CONSTRAINT "REL_e1d4fcfae63add22afa101332f" UNIQUE ("user_id"), CONSTRAINT "PK_51b2f6e36c3acee541c66bf4047" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "officer_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "activity_type" character varying(100) NOT NULL, "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL, "effective_from" TIMESTAMP WITH TIME ZONE, "effective_to" TIMESTAMP WITH TIME ZONE, "description" text, "metadata" jsonb, "officer_id" uuid NOT NULL, "employment_id" uuid, "performed_by_user_id" uuid, CONSTRAINT "PK_e92778ad14bdca908c3ef499a8a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_ACTIVITIES_OFFICER_OCCURRED" ON "officer_activities"  ("officer_id", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_ACTIVITIES_TYPE_OCCURRED" ON "officer_activities"  ("activity_type", "occurred_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_ACTIVITIES_EMPLOYMENT" ON "officer_activities"  ("employment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_ACTIVITIES_PERFORMED_BY" ON "officer_activities"  ("performed_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "officer_credentials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" character varying(100) NOT NULL, "credential_number" character varying(100), "issuing_authority" character varying(200), "issued_date" date, "expiry_date" date, "verification_status" character varying(30) NOT NULL DEFAULT 'pending', "verified_at" TIMESTAMP WITH TIME ZONE, "verified_by_user_id" uuid, "rejection_reason" text, "revoked_at" TIMESTAMP WITH TIME ZONE, "revocation_reason" text, "document_storage_key" character varying(1024), "document_file_name" character varying(255), "document_mime_type" character varying(150), "document_size_bytes" bigint, "document_sha256" character varying(64), "document_url" text, "officer_id" uuid NOT NULL, CONSTRAINT "PK_1c7b123b46d2e7c2a77cfb276b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_CREDENTIALS_OFFICER" ON "officer_credentials"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_CREDENTIALS_EXPIRY" ON "officer_credentials"  ("expiry_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_CREDENTIALS_VERIFICATION" ON "officer_credentials"  ("verification_status", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_CREDENTIALS_VERIFIED_BY" ON "officer_credentials"  ("verified_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "officer_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" character varying(100) NOT NULL, "file_name" character varying(255) NOT NULL, "storage_key" character varying(1024) NOT NULL, "mime_type" character varying(150) NOT NULL, "file_size_bytes" bigint NOT NULL, "sha256_hash" character varying(64), "status" character varying(30) NOT NULL DEFAULT 'pending_review', "description" text, "uploaded_by" uuid NOT NULL, "reviewed_at" TIMESTAMP WITH TIME ZONE, "reviewed_by_user_id" uuid, "review_notes" text, "expires_at" date, "replaces_document_id" uuid, "officer_id" uuid NOT NULL, CONSTRAINT "PK_023a6866be7e4f53a51fa939101" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_DOCUMENTS_OFFICER" ON "officer_documents"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_DOCUMENTS_TYPE" ON "officer_documents"  ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_DOCUMENTS_STATUS_CREATED" ON "officer_documents"  ("status", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_DOCUMENTS_UPLOADER" ON "officer_documents"  ("uploaded_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_DOCUMENTS_REVIEWER" ON "officer_documents"  ("reviewed_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OFFICER_DOCUMENTS_REPLACES" ON "officer_documents"  ("replaces_document_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "payroll_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "regular_hours" numeric(8,2) NOT NULL DEFAULT '0', "overtime_hours" numeric(8,2) NOT NULL DEFAULT '0', "night_diff_hours" numeric(8,2) NOT NULL DEFAULT '0', "base_rate" integer NOT NULL, "overtime_rate" integer NOT NULL, "overtime_multiplier" numeric(5,2) NOT NULL, "night_diff_rate" integer, "night_diff_multiplier" numeric(5,2), "currency_code" character varying(3) NOT NULL, "gross_pay" integer, "deductions" integer, "net_pay" integer, "adjustments" text, "actual_pay" integer, "notes" text, "status" character varying(50) NOT NULL DEFAULT 'draft', "calculated_at" TIMESTAMP WITH TIME ZONE, "approved_by_user_id" uuid, "approved_at" TIMESTAMP WITH TIME ZONE, "paid_at" TIMESTAMP WITH TIME ZONE, "payroll_period_id" uuid NOT NULL, "officer_id" uuid NOT NULL, "employment_id" uuid, "shift_id" uuid NOT NULL, CONSTRAINT "PK_749b8c91480734ee1e616d4456d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_PAYROLL_ENTRIES_PERIOD_SHIFT" ON "payroll_entries"  ("payroll_period_id", "shift_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_ENTRIES_PERIOD_OFFICER" ON "payroll_entries"  ("payroll_period_id", "officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_ENTRIES_SHIFT" ON "payroll_entries"  ("shift_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_ENTRIES_PERIOD_STATUS" ON "payroll_entries"  ("payroll_period_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_ENTRIES_OFFICER" ON "payroll_entries"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_ENTRIES_EMPLOYMENT" ON "payroll_entries"  ("employment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_ENTRIES_APPROVED_BY" ON "payroll_entries"  ("approved_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "payroll_periods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255), "description" text, "period_start" TIMESTAMP WITH TIME ZONE NOT NULL, "period_end" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'open', "approved_by" uuid, "approved_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2afd9a853dd55d80ef644b74358" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PAYROLL_PERIODS_APPROVED_BY" ON "payroll_periods"  ("approved_by") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL, "token_hash" text NOT NULL, "device_info" jsonb NOT NULL, "ip_address" inet NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_REFRESHTOKENS_TOKEN_HASH" ON "refresh_tokens"  ("token_hash") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_REFRESHTOKENS_USER_ID" ON "refresh_tokens"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "shifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "scheduled_start" TIMESTAMP WITH TIME ZONE NOT NULL, "scheduled_end" TIMESTAMP WITH TIME ZONE NOT NULL, "actual_start" TIMESTAMP WITH TIME ZONE, "actual_end" TIMESTAMP WITH TIME ZONE, "status" character varying(50) NOT NULL DEFAULT 'scheduled', "type" character varying(50) NOT NULL DEFAULT 'day', "notes" text, "notes_by_user_id" uuid, "assigned_by_user_id" uuid NOT NULL, "officer_id" uuid NOT NULL, "site_id" uuid NOT NULL, "client_id" uuid NOT NULL, "employment_id" uuid NOT NULL, CONSTRAINT "CHK_SHIFTS_SCHEDULED_TIME_RANGE" CHECK ("scheduled_end" > "scheduled_start"), CONSTRAINT "CHK_SHIFTS_ACTUAL_TIME_RANGE" CHECK ("actual_start" IS NULL OR "actual_end" IS NULL OR "actual_end" > "actual_start"), CONSTRAINT "CHK_SHIFTS_STATUS" CHECK ("status" IN ('scheduled', 'in_progress', 'completed', 'missed', 'cancelled', 'no_show')), CONSTRAINT "CHK_SHIFTS_TYPE" CHECK ("type" IN ('day', 'night', 'swing', 'other')), CONSTRAINT "PK_84d692e367e4d6cdf045828768c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SHIFTS_OFFICER_SCHEDULED_START" ON "shifts"  ("officer_id", "scheduled_start") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SHIFTS_SITE_SCHEDULED_START" ON "shifts"  ("site_id", "scheduled_start") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SHIFTS_STATUS_SCHEDULED_START" ON "shifts"  ("status", "scheduled_start") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SHIFTS_EMPLOYMENT_SCHEDULED_START" ON "shifts"  ("employment_id", "scheduled_start") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SHIFTS_ASSIGNED_BY_USER" ON "shifts"  ("assigned_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SHIFTS_NOTES_BY_USER" ON "shifts"  ("notes_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "sites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "geo_fence_radius_m" integer, "timezone" character varying(100) NOT NULL DEFAULT 'Indian/Mauritius', "check_in_interval_min" integer, "check_in_grace_min" integer, "is_active" boolean NOT NULL DEFAULT false, "client_id" uuid NOT NULL, CONSTRAINT "CHK_SITES_LATITUDE" CHECK ("latitude" BETWEEN -90 AND 90), CONSTRAINT "CHK_SITES_LONGITUDE" CHECK ("longitude" BETWEEN -180 AND 180), CONSTRAINT "CHK_SITES_GEOFENCE_RADIUS" CHECK ("geo_fence_radius_m" IS NULL OR "geo_fence_radius_m" > 0), CONSTRAINT "CHK_SITES_CHECKIN_INTERVAL" CHECK ("check_in_interval_min" IS NULL OR "check_in_interval_min" > 0), CONSTRAINT "CHK_SITES_CHECKIN_GRACE" CHECK ("check_in_grace_min" IS NULL OR "check_in_grace_min" >= 0), CONSTRAINT "CHK_SITES_NAME_NOT_EMPTY" CHECK (length(trim(name)) > 0), CONSTRAINT "CHK_SITES_ADDRESS_NOT_EMPTY" CHECK (length(trim(address)) > 0), CONSTRAINT "CHK_SITES_TIMEZONE_NOT_EMPTY" CHECK (length(trim(timezone)) > 0), CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_SITES_CLIENT_ID" ON "sites"  ("client_id") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_SITES_CLIENT_ACTIVE" ON "sites"  ("client_id", "is_active") `,
    );
    await queryRunner.query(
      `CREATE TABLE "site_checkpoints" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "label" character varying(100) NOT NULL, "checkpoint_code" character varying(100) NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "sequence_order" integer, "is_active" boolean NOT NULL DEFAULT false, "site_id" uuid NOT NULL, CONSTRAINT "CHK_SITE_CHECKPOINTS_LATITUDE" CHECK ("latitude" BETWEEN -90 AND 90), CONSTRAINT "CHK_SITE_CHECKPOINTS_LONGITUDE" CHECK ("longitude" BETWEEN -180 AND 180), CONSTRAINT "CHK_SITE_CHECKPOINTS_LABEL_NOT_EMPTY" CHECK (length(trim(label)) > 0), CONSTRAINT "CHK_SITE_CHECKPOINTS_CODE_NOT_EMPTY" CHECK (length(trim(checkpoint_code)) > 0), CONSTRAINT "CHK_SITE_CHECKPOINTS_SEQUENCE_ORDER" CHECK ("sequence_order" IS NULL OR "sequence_order" > 0), CONSTRAINT "PK_43537b65d950f4b603e930b74f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINTS_SITE_ID" ON "site_checkpoints"  ("site_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_SITE_CHECKPOINTS_SITE_CODE" ON "site_checkpoints"  ("site_id", "checkpoint_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINTS_SITE_ACTIVE" ON "site_checkpoints"  ("site_id", "is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINTS_SITE_SEQUENCE" ON "site_checkpoints"  ("site_id", "sequence_order") `,
    );
    await queryRunner.query(`CREATE TABLE "site_checkpoint_patrols" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "scanned_at" TIMESTAMP WITH TIME ZONE NOT NULL, "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "scan_method" character varying(30) NOT NULL, "status" character varying(30) NOT NULL DEFAULT 'pending', "validation_notes" text, "latitude" numeric(10,7), "longitude" numeric(10,7), "location_accuracy_m" numeric(8,2), "distance_from_checkpoint_m" numeric(10,2), "device_reference" character varying(150), "idempotency_key" character varying(150), "site_checkpoint_id" uuid NOT NULL, "officer_id" uuid NOT NULL, "shift_id" uuid, "recorded_by_user_id" uuid, "reviewed_by_user_id" uuid, "reviewed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_SCAN_METHOD" CHECK ("scan_method" IN (
        'nfc',
        'qr_code',
        'manual',
        'other'
      )), CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_STATUS" CHECK ("status" IN (
        'pending',
        'verified',
        'rejected',
        'flagged'
      )), CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_LATITUDE" CHECK ("latitude" IS NULL OR "latitude" BETWEEN -90 AND 90), CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_LONGITUDE" CHECK ("longitude" IS NULL OR "longitude" BETWEEN -180 AND 180), CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_LOCATION_PAIR" CHECK ((
        ("latitude" IS NULL AND "longitude" IS NULL)
        OR
        ("latitude" IS NOT NULL AND "longitude" IS NOT NULL)
      )), CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_LOCATION_ACCURACY" CHECK ("location_accuracy_m" IS NULL OR "location_accuracy_m" >= 0), CONSTRAINT "CHK_SITE_CHECKPOINT_PATROLS_DISTANCE" CHECK ("distance_from_checkpoint_m" IS NULL OR "distance_from_checkpoint_m" >= 0), CONSTRAINT "PK_d5e94d0520da9af71a552e64eae" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINT_PATROLS_CHECKPOINT_TIME" ON "site_checkpoint_patrols"  ("site_checkpoint_id", "scanned_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINT_PATROLS_OFFICER_TIME" ON "site_checkpoint_patrols"  ("officer_id", "scanned_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINT_PATROLS_SHIFT" ON "site_checkpoint_patrols"  ("shift_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINT_PATROLS_STATUS_TIME" ON "site_checkpoint_patrols"  ("status", "scanned_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINT_PATROLS_RECORDED_BY" ON "site_checkpoint_patrols"  ("recorded_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SITE_CHECKPOINT_PATROLS_REVIEWED_BY" ON "site_checkpoint_patrols"  ("reviewed_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_SITE_CHECKPOINT_PATROLS_IDEMPOTENCY" ON "site_checkpoint_patrols"  ("idempotency_key") `,
    );
    await queryRunner.query(`CREATE TABLE "staff_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "amount_due" integer NOT NULL, "currency_code" character varying(3) NOT NULL DEFAULT 'mur', "status" character varying(30) NOT NULL DEFAULT 'pending', "payment_method" character varying(30), "notes" text, "due_date" date, "first_paid_at" TIMESTAMP WITH TIME ZONE, "fully_paid_at" TIMESTAMP WITH TIME ZONE, "processed_by_user_id" uuid, "payroll_period_id" uuid NOT NULL, "officer_id" uuid NOT NULL, CONSTRAINT "CHK_STAFF_PAYMENTS_AMOUNT_DUE" CHECK ("amount_due" >= 0), CONSTRAINT "CHK_STAFF_PAYMENTS_STATUS" CHECK ("status" IN (
        'pending',
        'partially_paid',
        'paid',
        'on_hold',
        'cancelled'
      )), CONSTRAINT "PK_08b8ec23b6e9d01720ea81ffbe6" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_STAFF_PAYMENTS_PERIOD_OFFICER" ON "staff_payments"  ("payroll_period_id", "officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENTS_STATUS" ON "staff_payments"  ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENTS_PERIOD_STATUS" ON "staff_payments"  ("payroll_period_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENTS_OFFICER" ON "staff_payments"  ("officer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENTS_PROCESSED_BY" ON "staff_payments"  ("processed_by_user_id") `,
    );
    await queryRunner.query(`CREATE TABLE "staff_payment_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "transaction_number" character varying(100) NOT NULL, "amount" integer NOT NULL, "currency_code" character varying(3) NOT NULL DEFAULT 'mur', "payment_method" character varying(30) NOT NULL, "status" character varying(30) NOT NULL DEFAULT 'pending', "provider_reference" character varying(150), "initiated_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "failed_at" TIMESTAMP WITH TIME ZONE, "failure_reason" text, "notes" text, "metadata" jsonb, "idempotency_key" character varying(150), "staff_payment_id" uuid NOT NULL, "officer_id" uuid NOT NULL, "processed_by_user_id" uuid, CONSTRAINT "CHK_STAFF_PAYMENT_TRANSACTIONS_AMOUNT" CHECK ("amount" > 0), CONSTRAINT "CHK_STAFF_PAYMENT_TRANSACTIONS_STATUS" CHECK ("status" IN (
        'pending',
        'processing',
        'succeeded',
        'failed',
        'cancelled'
      )), CONSTRAINT "CHK_STAFF_PAYMENT_TRANSACTIONS_METHOD" CHECK ("payment_method" IN (
        'bank_transfer',
        'cash',
        'cheque',
        'mobile_money',
        'other'
      )), CONSTRAINT "PK_9c9ccd2d5a1581758aac0cb18f0" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_STAFF_PAYMENT_TRANSACTIONS_NUMBER" ON "staff_payment_transactions"  ("transaction_number") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_STAFF_PAYMENT_TRANSACTIONS_IDEMPOTENCY" ON "staff_payment_transactions"  ("idempotency_key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TRANSACTIONS_PAYMENT" ON "staff_payment_transactions"  ("staff_payment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TRANSACTIONS_PAYMENT_STATUS" ON "staff_payment_transactions"  ("staff_payment_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TRANSACTIONS_PROVIDER_REFERENCE" ON "staff_payment_transactions"  ("provider_reference") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TRANSACTIONS_PROCESSED_BY" ON "staff_payment_transactions"  ("processed_by_user_id") `,
    );
    await queryRunner.query(`CREATE TABLE "staff_payment_transaction_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" character varying(50) NOT NULL, "file_name" character varying(255) NOT NULL, "storage_key" character varying(500) NOT NULL, "mime_type" character varying(150) NOT NULL, "file_size_bytes" bigint NOT NULL, "sha256_hash" character varying(64), "description" text, "status" character varying(30) NOT NULL DEFAULT 'pending_review', "uploaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reviewed_at" TIMESTAMP WITH TIME ZONE, "review_notes" text, "uploaded_by_user_id" uuid NOT NULL, "reviewed_by_user_id" uuid, "staff_payment_transaction_id" uuid NOT NULL, "replaces_attachment_id" uuid, CONSTRAINT "CHK_STAFF_PAYMENT_TX_ATTACHMENTS_TYPE" CHECK ("type" IN (
        'payment_receipt',
        'bank_confirmation',
        'cheque_image',
        'failure_report',
        'reconciliation_document',
        'other'
      )), CONSTRAINT "CHK_STAFF_PAYMENT_TX_ATTACHMENTS_STATUS" CHECK ("status" IN (
        'pending_review',
        'approved',
        'rejected',
        'archived'
      )), CONSTRAINT "CHK_STAFF_PAYMENT_TX_ATTACHMENTS_FILE_SIZE" CHECK ("file_size_bytes" > 0), CONSTRAINT "CHK_STAFF_PAYMENT_TX_ATTACHMENTS_SHA256" CHECK ("sha256_hash" IS NULL OR "sha256_hash" ~ '^[a-fA-F0-9]{64}$'), CONSTRAINT "PK_d427856671a8f7622fcaf66208e" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_TRANSACTION" ON "staff_payment_transaction_attachments"  ("staff_payment_transaction_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_TYPE" ON "staff_payment_transaction_attachments"  ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_STATUS" ON "staff_payment_transaction_attachments"  ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_UPLOADED_BY" ON "staff_payment_transaction_attachments"  ("uploaded_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_REVIEWED_BY" ON "staff_payment_transaction_attachments"  ("reviewed_by_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_REPLACES" ON "staff_payment_transaction_attachments"  ("replaces_attachment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_STAFF_PAYMENT_TX_ATTACHMENTS_CREATED_AT" ON "staff_payment_transaction_attachments"  ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "system_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "key" character varying(100) NOT NULL, "value" jsonb NOT NULL, "description" text, "updated_by" uuid, CONSTRAINT "UQ_b1b5bc664526d375c94ce9ad43d" UNIQUE ("key"), CONSTRAINT "PK_82521f08790d248b2a80cc85d40" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SYSTEM_SETTINGS_UPDATED_BY" ON "system_settings"  ("updated_by") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "username" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "first_name" character varying(100) NOT NULL, "other_names" character varying(100), "last_name" character varying(100) NOT NULL, "organization_name" character varying(100), "profile_photo_url" text, "phone" character varying(50), "is_online" boolean NOT NULL DEFAULT true, "last_activity" TIMESTAMP WITH TIME ZONE, "role" character varying(50) NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USERS_USERNAME" ON "users"  ("username") `);
    await queryRunner.query(
      `ALTER TABLE "attendance_events" ADD CONSTRAINT "FK_9857cc2504d3ba47f8b49b72bbb" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_events" ADD CONSTRAINT "FK_efceb1034b89d85baf772587563" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_events" ADD CONSTRAINT "FK_f69553d17b60fcf0dd21a345c6b" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" ADD CONSTRAINT "FK_51f7aae0e01119b715b9a6d68cc" FOREIGN KEY ("initiated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" ADD CONSTRAINT "FK_e92d4c02bc6e763abf368f51471" FOREIGN KEY ("emergency_alert_id") REFERENCES "emergency_alerts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" ADD CONSTRAINT "FK_1e7923f771e4ce59f88f5a18441" FOREIGN KEY ("check_in_schedule_id") REFERENCES "check_in_schedules"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" ADD CONSTRAINT "FK_77d6795153660ea70e46d00c050" FOREIGN KEY ("caller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" ADD CONSTRAINT "FK_69a9ca6c5528776f5f1809f9e49" FOREIGN KEY ("callee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" ADD CONSTRAINT "FK_e52ad3e3986f97bdc61c454ab69" FOREIGN KEY ("acknowledged_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" ADD CONSTRAINT "FK_353aacf2f22eff5e89e9cef10d5" FOREIGN KEY ("check_in_schedule_id") REFERENCES "check_in_schedules"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" ADD CONSTRAINT "FK_82151a4e4749e6c5834b2a97739" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" ADD CONSTRAINT "FK_203261768d113ae308b04c06a68" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_responses" ADD CONSTRAINT "FK_c92b9bb3c4c499302f1f810a549" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_responses" ADD CONSTRAINT "FK_93213e683d001da795c8554cb6e" FOREIGN KEY ("check_in_schedule_id") REFERENCES "check_in_schedules"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_schedules" ADD CONSTRAINT "FK_1432f2aabd7d832d90e2bae1bb1" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_schedules" ADD CONSTRAINT "FK_857dd6f105fd66b9689c6b5e828" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_schedules" ADD CONSTRAINT "FK_f0125938c1de4a83cd267a736d8" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_activities" ADD CONSTRAINT "FK_251fe1133a5d86a753ed9d80d23" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_users" ADD CONSTRAINT "FK_934bd66f558a7304bf4d2c2597b" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_users" ADD CONSTRAINT "FK_132c5c724fd35a3001421547513" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_users" ADD CONSTRAINT "FK_58865d94acc918196756ecdd7a7" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_histories" ADD CONSTRAINT "FK_2cb4a7976c907a88019c54c6280" FOREIGN KEY ("employment_id") REFERENCES "employments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_histories" ADD CONSTRAINT "FK_ce150956c041143a537cb29c67f" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_histories" ADD CONSTRAINT "FK_ce119151c32238e5a5a1f93d8d7" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" ADD CONSTRAINT "FK_d700b3629bbd52ff2d919e8764e" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" ADD CONSTRAINT "FK_d9a82a8e82ce2f0d8795f594565" FOREIGN KEY ("acknowledged_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" ADD CONSTRAINT "FK_30f55a1b5726aa90b6a715c0266" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" ADD CONSTRAINT "FK_7877706cee88bf9b3051d4ededa" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" ADD CONSTRAINT "FK_d1c721c4ba7b19ffb9527b21720" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" ADD CONSTRAINT "FK_d91a921b63bf6c6985b220e7de2" FOREIGN KEY ("check_in_schedule_id") REFERENCES "check_in_schedules"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_events" ADD CONSTRAINT "FK_8a922bb10c6f15f3d434e247dde" FOREIGN KEY ("emergency_alert_id") REFERENCES "emergency_alerts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_events" ADD CONSTRAINT "FK_c85f0cbdfd2c66c767218285668" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_notifications" ADD CONSTRAINT "FK_a30b8969159bb3a9dba40c4d12a" FOREIGN KEY ("emergency_alert_id") REFERENCES "emergency_alerts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_notifications" ADD CONSTRAINT "FK_0840855b6066b27e04a9bf667c6" FOREIGN KEY ("emergency_alert_responder_id") REFERENCES "emergency_alert_responders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_responders" ADD CONSTRAINT "FK_2b09474464f8845fbd9992c7f5d" FOREIGN KEY ("emergency_alert_id") REFERENCES "emergency_alerts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_responders" ADD CONSTRAINT "FK_0266607f416f5c3cba572ba1e56" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employments" ADD CONSTRAINT "FK_8248a17f3fa7d58b7f2d4bb8de7" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_52364a875efb54abc0cd1199ee0" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_29aabed443bf785d70ab96a0504" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_ffa0ae75ce769e34cb9abfaaad4" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_3c2226dc3d580c5c9070f186d00" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_53adbdfad0fff02d5dc81431728" FOREIGN KEY ("emergency_alert_id") REFERENCES "emergency_alerts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_attachments" ADD CONSTRAINT "FK_83caa236f28b5bdd35322bf4446" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_attachments" ADD CONSTRAINT "FK_a972b08d70271cb796a1da67b51" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_attachments" ADD CONSTRAINT "FK_9b57713f6910cb371e257409eac" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_events" ADD CONSTRAINT "FK_390f216bd2d62482f4a2602b5e8" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_events" ADD CONSTRAINT "FK_e82ee40e0d0a6a2f39cc37efa0f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_notifications" ADD CONSTRAINT "FK_45b17252b798b0bbc2473fa649f" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_notifications" ADD CONSTRAINT "FK_3457a9d6a88d9741f93e627742d" FOREIGN KEY ("notified_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officers" ADD CONSTRAINT "FK_e1d4fcfae63add22afa101332f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_activities" ADD CONSTRAINT "FK_9c4e2f14a79d86fceda10d0e17c" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_activities" ADD CONSTRAINT "FK_31218d7e3d6619f34f2ab9bd70a" FOREIGN KEY ("employment_id") REFERENCES "employments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_activities" ADD CONSTRAINT "FK_b85cfd3c9998bc0f4a56c649429" FOREIGN KEY ("performed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_credentials" ADD CONSTRAINT "FK_88e452f92c5c8edf938d37f59f8" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_credentials" ADD CONSTRAINT "FK_b96e79dd02d7a64efdb33a0541e" FOREIGN KEY ("verified_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" ADD CONSTRAINT "FK_9d1444d8a063f3a2c3be8aa5c40" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" ADD CONSTRAINT "FK_f3119a9a2d0b4f303eb5a7533d1" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" ADD CONSTRAINT "FK_3f02ada811712e04149417d48e1" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" ADD CONSTRAINT "FK_cf04df282689a760d04b3d3cf56" FOREIGN KEY ("replaces_document_id") REFERENCES "officer_documents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" ADD CONSTRAINT "FK_dc91b80cda0b7dcc3f44d50e5bf" FOREIGN KEY ("payroll_period_id") REFERENCES "payroll_periods"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" ADD CONSTRAINT "FK_68979e6752298bdffb2c5633fba" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" ADD CONSTRAINT "FK_84bba2f2c15dabb4894093e3df1" FOREIGN KEY ("employment_id") REFERENCES "employments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" ADD CONSTRAINT "FK_4213baeaae06420dd5c3324d3ed" FOREIGN KEY ("approved_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" ADD CONSTRAINT "FK_b93a3d0c608d3ab016a082fb250" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_periods" ADD CONSTRAINT "FK_180dacd2a4f06958df34b5a308b" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_b3d1d29605805f1462fb52dcc7a" FOREIGN KEY ("assigned_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_12fc336d6399aab6256c65cfeb9" FOREIGN KEY ("notes_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_23a77f7d1c00234dc2a94190812" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_9b33dd6785443d8392a742a4392" FOREIGN KEY ("employment_id") REFERENCES "employments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_5a77b6a77621127db084c7a042b" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_e3778eac3a27199aabb29d1724f" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoints" ADD CONSTRAINT "FK_af3953d2f1bfb88b9296769c623" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" ADD CONSTRAINT "FK_9d1f56761df0ad2784da5f3d9b9" FOREIGN KEY ("site_checkpoint_id") REFERENCES "site_checkpoints"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" ADD CONSTRAINT "FK_e14af6ff89cdf6b5e9e436e09bb" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" ADD CONSTRAINT "FK_67b466cd463d8bd2245625b492d" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" ADD CONSTRAINT "FK_b388acf6a0d6d0a731a784b7f8e" FOREIGN KEY ("recorded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" ADD CONSTRAINT "FK_dc58a6f2a594ea6e98e129d1dd8" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payments" ADD CONSTRAINT "FK_88486bb50fc3ecde6fbde42ae59" FOREIGN KEY ("payroll_period_id") REFERENCES "payroll_periods"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payments" ADD CONSTRAINT "FK_0e891f37146f4c988dc3a23169b" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payments" ADD CONSTRAINT "FK_fc94dcd3343cefc79ab5ae0c7e3" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transactions" ADD CONSTRAINT "FK_ea8ab3e072c60190c59228b44d0" FOREIGN KEY ("staff_payment_id") REFERENCES "staff_payments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transactions" ADD CONSTRAINT "FK_0824c7322d4656995f4850522e0" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transactions" ADD CONSTRAINT "FK_0be89d8f623af35617a8bdfebb3" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" ADD CONSTRAINT "FK_e286613423a2928094e50e8ad0e" FOREIGN KEY ("staff_payment_transaction_id") REFERENCES "staff_payment_transactions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" ADD CONSTRAINT "FK_8475646d9f6032e55e6f7ee84de" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" ADD CONSTRAINT "FK_f955e26401027809f7a7b36236b" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" ADD CONSTRAINT "FK_41a5982b92dd5f8980b89dde4bd" FOREIGN KEY ("replaces_attachment_id") REFERENCES "staff_payment_transaction_attachments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_settings" ADD CONSTRAINT "FK_301c531938f84c39fa5019e7465" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "system_settings" DROP CONSTRAINT "FK_301c531938f84c39fa5019e7465"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" DROP CONSTRAINT "FK_41a5982b92dd5f8980b89dde4bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" DROP CONSTRAINT "FK_f955e26401027809f7a7b36236b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" DROP CONSTRAINT "FK_8475646d9f6032e55e6f7ee84de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transaction_attachments" DROP CONSTRAINT "FK_e286613423a2928094e50e8ad0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transactions" DROP CONSTRAINT "FK_0be89d8f623af35617a8bdfebb3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transactions" DROP CONSTRAINT "FK_0824c7322d4656995f4850522e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payment_transactions" DROP CONSTRAINT "FK_ea8ab3e072c60190c59228b44d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payments" DROP CONSTRAINT "FK_fc94dcd3343cefc79ab5ae0c7e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payments" DROP CONSTRAINT "FK_0e891f37146f4c988dc3a23169b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_payments" DROP CONSTRAINT "FK_88486bb50fc3ecde6fbde42ae59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" DROP CONSTRAINT "FK_dc58a6f2a594ea6e98e129d1dd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" DROP CONSTRAINT "FK_b388acf6a0d6d0a731a784b7f8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" DROP CONSTRAINT "FK_67b466cd463d8bd2245625b492d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" DROP CONSTRAINT "FK_e14af6ff89cdf6b5e9e436e09bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoint_patrols" DROP CONSTRAINT "FK_9d1f56761df0ad2784da5f3d9b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_checkpoints" DROP CONSTRAINT "FK_af3953d2f1bfb88b9296769c623"`,
    );
    await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT "FK_e3778eac3a27199aabb29d1724f"`);
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_5a77b6a77621127db084c7a042b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_9b33dd6785443d8392a742a4392"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_23a77f7d1c00234dc2a94190812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_12fc336d6399aab6256c65cfeb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_b3d1d29605805f1462fb52dcc7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_periods" DROP CONSTRAINT "FK_180dacd2a4f06958df34b5a308b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" DROP CONSTRAINT "FK_b93a3d0c608d3ab016a082fb250"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" DROP CONSTRAINT "FK_4213baeaae06420dd5c3324d3ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" DROP CONSTRAINT "FK_84bba2f2c15dabb4894093e3df1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" DROP CONSTRAINT "FK_68979e6752298bdffb2c5633fba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" DROP CONSTRAINT "FK_dc91b80cda0b7dcc3f44d50e5bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" DROP CONSTRAINT "FK_cf04df282689a760d04b3d3cf56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" DROP CONSTRAINT "FK_3f02ada811712e04149417d48e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" DROP CONSTRAINT "FK_f3119a9a2d0b4f303eb5a7533d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_documents" DROP CONSTRAINT "FK_9d1444d8a063f3a2c3be8aa5c40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_credentials" DROP CONSTRAINT "FK_b96e79dd02d7a64efdb33a0541e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_credentials" DROP CONSTRAINT "FK_88e452f92c5c8edf938d37f59f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_activities" DROP CONSTRAINT "FK_b85cfd3c9998bc0f4a56c649429"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_activities" DROP CONSTRAINT "FK_31218d7e3d6619f34f2ab9bd70a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officer_activities" DROP CONSTRAINT "FK_9c4e2f14a79d86fceda10d0e17c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "officers" DROP CONSTRAINT "FK_e1d4fcfae63add22afa101332f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_notifications" DROP CONSTRAINT "FK_3457a9d6a88d9741f93e627742d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_notifications" DROP CONSTRAINT "FK_45b17252b798b0bbc2473fa649f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_events" DROP CONSTRAINT "FK_e82ee40e0d0a6a2f39cc37efa0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_events" DROP CONSTRAINT "FK_390f216bd2d62482f4a2602b5e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_attachments" DROP CONSTRAINT "FK_9b57713f6910cb371e257409eac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_attachments" DROP CONSTRAINT "FK_a972b08d70271cb796a1da67b51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident_attachments" DROP CONSTRAINT "FK_83caa236f28b5bdd35322bf4446"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_53adbdfad0fff02d5dc81431728"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_3c2226dc3d580c5c9070f186d00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_ffa0ae75ce769e34cb9abfaaad4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_29aabed443bf785d70ab96a0504"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_52364a875efb54abc0cd1199ee0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employments" DROP CONSTRAINT "FK_8248a17f3fa7d58b7f2d4bb8de7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_responders" DROP CONSTRAINT "FK_0266607f416f5c3cba572ba1e56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_responders" DROP CONSTRAINT "FK_2b09474464f8845fbd9992c7f5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_notifications" DROP CONSTRAINT "FK_0840855b6066b27e04a9bf667c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_notifications" DROP CONSTRAINT "FK_a30b8969159bb3a9dba40c4d12a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_events" DROP CONSTRAINT "FK_c85f0cbdfd2c66c767218285668"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alert_events" DROP CONSTRAINT "FK_8a922bb10c6f15f3d434e247dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" DROP CONSTRAINT "FK_d91a921b63bf6c6985b220e7de2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" DROP CONSTRAINT "FK_d1c721c4ba7b19ffb9527b21720"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" DROP CONSTRAINT "FK_7877706cee88bf9b3051d4ededa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" DROP CONSTRAINT "FK_30f55a1b5726aa90b6a715c0266"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" DROP CONSTRAINT "FK_d9a82a8e82ce2f0d8795f594565"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emergency_alerts" DROP CONSTRAINT "FK_d700b3629bbd52ff2d919e8764e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" DROP CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_histories" DROP CONSTRAINT "FK_ce119151c32238e5a5a1f93d8d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_histories" DROP CONSTRAINT "FK_ce150956c041143a537cb29c67f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_histories" DROP CONSTRAINT "FK_2cb4a7976c907a88019c54c6280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_users" DROP CONSTRAINT "FK_58865d94acc918196756ecdd7a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_users" DROP CONSTRAINT "FK_132c5c724fd35a3001421547513"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_users" DROP CONSTRAINT "FK_934bd66f558a7304bf4d2c2597b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_activities" DROP CONSTRAINT "FK_251fe1133a5d86a753ed9d80d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_schedules" DROP CONSTRAINT "FK_f0125938c1de4a83cd267a736d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_schedules" DROP CONSTRAINT "FK_857dd6f105fd66b9689c6b5e828"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_schedules" DROP CONSTRAINT "FK_1432f2aabd7d832d90e2bae1bb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_responses" DROP CONSTRAINT "FK_93213e683d001da795c8554cb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_responses" DROP CONSTRAINT "FK_c92b9bb3c4c499302f1f810a549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" DROP CONSTRAINT "FK_203261768d113ae308b04c06a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" DROP CONSTRAINT "FK_82151a4e4749e6c5834b2a97739"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" DROP CONSTRAINT "FK_353aacf2f22eff5e89e9cef10d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "check_in_alerts" DROP CONSTRAINT "FK_e52ad3e3986f97bdc61c454ab69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" DROP CONSTRAINT "FK_69a9ca6c5528776f5f1809f9e49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" DROP CONSTRAINT "FK_77d6795153660ea70e46d00c050"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" DROP CONSTRAINT "FK_1e7923f771e4ce59f88f5a18441"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" DROP CONSTRAINT "FK_e92d4c02bc6e763abf368f51471"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_sessions" DROP CONSTRAINT "FK_51f7aae0e01119b715b9a6d68cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_events" DROP CONSTRAINT "FK_f69553d17b60fcf0dd21a345c6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_events" DROP CONSTRAINT "FK_efceb1034b89d85baf772587563"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_events" DROP CONSTRAINT "FK_9857cc2504d3ba47f8b49b72bbb"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_USERS_USERNAME"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SYSTEM_SETTINGS_UPDATED_BY"`);
    await queryRunner.query(`DROP TABLE "system_settings"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_REPLACES"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_REVIEWED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_UPLOADED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_TYPE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TX_ATTACHMENTS_TRANSACTION"`);
    await queryRunner.query(`DROP TABLE "staff_payment_transaction_attachments"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TRANSACTIONS_PROCESSED_BY"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_STAFF_PAYMENT_TRANSACTIONS_PROVIDER_REFERENCE"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TRANSACTIONS_PAYMENT_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENT_TRANSACTIONS_PAYMENT"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_STAFF_PAYMENT_TRANSACTIONS_IDEMPOTENCY"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_STAFF_PAYMENT_TRANSACTIONS_NUMBER"`);
    await queryRunner.query(`DROP TABLE "staff_payment_transactions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENTS_PROCESSED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENTS_OFFICER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENTS_PERIOD_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STAFF_PAYMENTS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_STAFF_PAYMENTS_PERIOD_OFFICER"`);
    await queryRunner.query(`DROP TABLE "staff_payments"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_SITE_CHECKPOINT_PATROLS_IDEMPOTENCY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINT_PATROLS_REVIEWED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINT_PATROLS_RECORDED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINT_PATROLS_STATUS_TIME"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINT_PATROLS_SHIFT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINT_PATROLS_OFFICER_TIME"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINT_PATROLS_CHECKPOINT_TIME"`);
    await queryRunner.query(`DROP TABLE "site_checkpoint_patrols"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINTS_SITE_SEQUENCE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINTS_SITE_ACTIVE"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_SITE_CHECKPOINTS_SITE_CODE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITE_CHECKPOINTS_SITE_ID"`);
    await queryRunner.query(`DROP TABLE "site_checkpoints"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITES_CLIENT_ACTIVE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SITES_CLIENT_ID"`);
    await queryRunner.query(`DROP TABLE "sites"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SHIFTS_NOTES_BY_USER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SHIFTS_ASSIGNED_BY_USER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SHIFTS_EMPLOYMENT_SCHEDULED_START"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SHIFTS_STATUS_SCHEDULED_START"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SHIFTS_SITE_SCHEDULED_START"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_SHIFTS_OFFICER_SCHEDULED_START"`);
    await queryRunner.query(`DROP TABLE "shifts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_REFRESHTOKENS_USER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_REFRESHTOKENS_TOKEN_HASH"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_PERIODS_APPROVED_BY"`);
    await queryRunner.query(`DROP TABLE "payroll_periods"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_ENTRIES_APPROVED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_ENTRIES_EMPLOYMENT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_ENTRIES_OFFICER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_ENTRIES_PERIOD_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_ENTRIES_SHIFT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_PAYROLL_ENTRIES_PERIOD_OFFICER"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_PAYROLL_ENTRIES_PERIOD_SHIFT"`);
    await queryRunner.query(`DROP TABLE "payroll_entries"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_DOCUMENTS_REPLACES"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_DOCUMENTS_REVIEWER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_DOCUMENTS_UPLOADER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_DOCUMENTS_STATUS_CREATED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_DOCUMENTS_TYPE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_DOCUMENTS_OFFICER"`);
    await queryRunner.query(`DROP TABLE "officer_documents"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_CREDENTIALS_VERIFIED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_CREDENTIALS_VERIFICATION"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_CREDENTIALS_EXPIRY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_CREDENTIALS_OFFICER"`);
    await queryRunner.query(`DROP TABLE "officer_credentials"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_ACTIVITIES_PERFORMED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_ACTIVITIES_EMPLOYMENT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_ACTIVITIES_TYPE_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_OFFICER_ACTIVITIES_OFFICER_OCCURRED"`);
    await queryRunner.query(`DROP TABLE "officer_activities"`);
    await queryRunner.query(`DROP TABLE "officers"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_NOTIFICATIONS_TYPE_CREATED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_NOTIFICATIONS_USER_CREATED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_NOTIFICATIONS_USER_ID"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_NOTIFICATIONS_INCIDENT_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_NOTIFICATIONS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_NOTIFICATIONS_USER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_NOTIFICATIONS_INCIDENT"`);
    await queryRunner.query(`DROP TABLE "incident_notifications"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_EVENTS_CORRELATION"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_EVENTS_ACTOR_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_EVENTS_TYPE_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_EVENTS_INCIDENT_OCCURRED"`);
    await queryRunner.query(`DROP TABLE "incident_events"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_ATTACHMENTS_COLLECTED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_ATTACHMENTS_REVIEWED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_ATTACHMENTS_EVIDENCE_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_ATTACHMENTS_UPLOADED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENT_ATTACHMENTS_INCIDENT"`);
    await queryRunner.query(`DROP TABLE "incident_attachments"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_REVIEWED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_SITE_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_SHIFT_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_OFFICER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_SEVERITY_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_TYPE_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INCIDENTS_STATUS_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_INCIDENTS_INCIDENT_NUMBER"`);
    await queryRunner.query(`DROP TABLE "incidents"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYMENTS_HIRE_DATE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYMENTS_OFFICER_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYMENTS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYMENTS_OFFICER"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_EMPLOYMENTS_EMPLOYEE_CODE"`);
    await queryRunner.query(`DROP TABLE "employments"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_RESPONDERS_STATUS_NOTIFIED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_RESPONDERS_USER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_RESPONDERS_ALERT_STATUS"`);
    await queryRunner.query(`DROP TABLE "emergency_alert_responders"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_NOTIFICATIONS_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_NOTIFICATIONS_PROVIDER_MESSAGE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_NOTIFICATIONS_RESPONDER"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_NOTIFICATIONS_STATUS_NEXT_ATTEMPT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_NOTIFICATIONS_ALERT_STATUS"`);
    await queryRunner.query(`DROP TABLE "emergency_alert_notifications"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_EVENTS_CORRELATION"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_EVENTS_ACTOR_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_EVENTS_TYPE_OCCURRED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EA_EVENTS_ALERT_OCCURRED"`);
    await queryRunner.query(`DROP TABLE "emergency_alert_events"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_CHECK_IN_SCHEDULE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_RESOLVED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_ACKNOWLEDGED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_SITE_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_SHIFT_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_OFFICER_TRIGGERED"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_SEVERITY_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMERGENCY_ALERTS_STATUS_TRIGGERED"`);
    await queryRunner.query(`DROP TABLE "emergency_alerts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_DEVICE_TOKENS_EXPIRATION"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_DEVICE_TOKENS_USER_ACTIVE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_DEVICE_TOKENS_USER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_DEVICE_TOKENS_TOKEN_HASH"`);
    await queryRunner.query(`DROP TABLE "device_tokens"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_COMPENSATION_HISTORY_CREATED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_COMPENSATION_HISTORY_EFFECTIVE_DATES"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_COMPENSATION_HISTORY_EMPLOYMENT"`);
    await queryRunner.query(`DROP TABLE "compensation_histories"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENT_USERS_INVITED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENT_USERS_CLIENT_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENT_USERS_USER_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_CLIENT_USERS_CLIENT_USER"`);
    await queryRunner.query(`DROP TABLE "client_users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENT_ACTIVITIES_TYPE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENT_ACTIVITIES_CLIENT_OCCURRED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENT_ACTIVITIES_CLIENT_ID"`);
    await queryRunner.query(`DROP TABLE "client_activities"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENTS_STATUS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CLIENTS_USER_ID"`);
    await queryRunner.query(`DROP TABLE "clients"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_SCHEDULES_OFFICER_SCHEDULED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_SCHEDULES_STATUS_GRACE_UNTIL"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_SCHEDULES_SITE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_SCHEDULES_SHIFT_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_SCHEDULES_OFFICER_ID"`);
    await queryRunner.query(`DROP TABLE "check_in_schedules"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_RESPONSES_SCHEDULE_RESPONDED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_RESPONSES_OFFICER_RESPONDED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_RESPONSES_SCHEDULE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_RESPONSES_OFFICER_ID"`);
    await queryRunner.query(`DROP TABLE "check_in_responses"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_ALERTS_ACKNOWLEDGED_BY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_ALERTS_LEVEL_ALERTED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_ALERTS_SITE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_ALERTS_OFFICER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CHECK_IN_ALERTS_SCHEDULE_ID"`);
    await queryRunner.query(`DROP TABLE "check_in_alerts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CALL_SESSIONS_STATUS_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CALL_SESSIONS_CHECK_IN_SCHEDULE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CALL_SESSIONS_EMERGENCY_ALERT_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CALL_SESSIONS_INITIATED_BY_USER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CALL_SESSIONS_CALLEE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CALL_SESSIONS_CALLER_ID"`);
    await queryRunner.query(`DROP TABLE "call_sessions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_AUDIT_LOGS_IP_ADDRESS"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_AUDIT_LOGS_ACTION_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_AUDIT_LOGS_ENTITY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_AUDIT_LOGS_ACTOR_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_AUDIT_LOGS_ACTOR_USER_ID"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ATTENDANCE_EVENTS_SITE_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ATTENDANCE_EVENTS_SHIFT_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ATTENDANCE_EVENTS_OFFICER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ATTENDANCE_EVENTS_LATITUDE_LONGITUDE"`);
    await queryRunner.query(`DROP TABLE "attendance_events"`);
  }
}
