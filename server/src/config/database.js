import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import config from './index.js';
import logger from './logger.js';
import { AttendanceEvent } from '../app/entities/AttendanceEvent.js';
import { AuditLog } from '../app/entities/AuditLog.js';
import { CallSession } from '../app/entities/CallSession.js';
import { CheckInAlert } from '../app/entities/CheckInAlert.js';
import { CheckInResponse } from '../app/entities/CheckInResponse.js';
import { CheckInSchedule } from '../app/entities/CheckInSchedule.js';
import { Client } from '../app/entities/Client.js';
import { ClientActivity } from '../app/entities/ClientActivity.js';
import { ClientUser } from '../app/entities/ClientUser.js';
import { CompensationHistory } from '../app/entities/CompensationHistory.js';
import { DeviceToken } from '../app/entities/DeviceToken.js';
import { EmergencyAlert } from '../app/entities/EmergencyAlert.js';
import { EmergencyAlertEvent } from '../app/entities/EmergencyAlertEvent.js';
import { EmergencyAlertNotification } from '../app/entities/EmergencyAlertNotification.js';
import { EmergencyAlertResponder } from '../app/entities/EmergencyAlertResponder.js';
import { Employment } from '../app/entities/Employment.js';
import { Incident } from '../app/entities/Incident.js';
import { IncidentAttachment } from '../app/entities/IncidentAttachment.js';
import { IncidentEvent } from '../app/entities/IncidentEvent.js';
import { IncidentNotification } from '../app/entities/IncidentNotification.js';
import { Notification } from '../app/entities/Notification.js';
import { Officer } from '../app/entities/Officer.js';
import { OfficerActivity } from '../app/entities/OfficerActivity.js';
import { OfficerCredential } from '../app/entities/OfficerCredential.js';
import { OfficerDocument } from '../app/entities/OfficerDocument.js';
import { PayrollEntry } from '../app/entities/PayrollEntry.js';
import { PayrollPeriod } from '../app/entities/PayrollPeriod.js';
import { RefreshToken } from '../app/entities/RefreshToken.js';
import { Shift } from '../app/entities/Shift.js';
import { Site } from '../app/entities/Site.js';
import { SiteCheckpoint } from '../app/entities/SiteCheckpoint.js';
import { SiteCheckpointPatrol } from '../app/entities/SiteCheckpointPatrol.js';
import { StaffPayment } from '../app/entities/StaffPayment.js';
import { StaffPaymentTransaction } from '../app/entities/StaffPaymentTransaction.js';
import { StaffPaymentTransactionAttachment } from '../app/entities/StaffPaymentTransactionAttachment.js';
import { SystemSetting } from '../app/entities/SystemSetting.js';
import { User } from '../app/entities/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsGlob = path.join(__dirname, '..', 'database', 'migrations', '*.js');

const AppDataSource = new DataSource({
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.db.synchronize,
  logging: config.db.logging,
  entities: [
    AttendanceEvent,
    AuditLog,
    CallSession,
    CheckInAlert,
    CheckInResponse,
    CheckInSchedule,
    Client,
    ClientActivity,
    ClientUser,
    CompensationHistory,
    DeviceToken,
    EmergencyAlert,
    EmergencyAlertEvent,
    EmergencyAlertNotification,
    EmergencyAlertResponder,
    Employment,
    Incident,
    IncidentAttachment,
    IncidentEvent,
    IncidentNotification,
    Notification,
    Officer,
    OfficerActivity,
    OfficerCredential,
    OfficerDocument,
    PayrollEntry,
    PayrollPeriod,
    RefreshToken,
    Shift,
    Site,
    SiteCheckpoint,
    SiteCheckpointPatrol,
    StaffPayment,
    StaffPaymentTransaction,
    StaffPaymentTransactionAttachment,
    SystemSetting,
    User,
  ],
  migrations: [migrationsGlob],
  migrationsTableName: 'migrations',
  subscribers: [],
  extra: {
    max: config.db.poolMax,
    connectionTimeoutMillis: config.db.connectionTimeoutMs,
  },
});

export const initializeDatabase = async () => {
  if (AppDataSource.isInitialized) return AppDataSource;

  try {
    await AppDataSource.initialize();
    logger.info(
      { host: config.db.host, database: config.db.database },
      'Database connection established',
    );
    return AppDataSource;
  } catch (error) {
    logger.error({ err: error }, 'Database connection failed');
    throw error;
  }
};

export const closeDatabase = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  }
};

export default AppDataSource;
