import { EntitySchema } from 'typeorm'; 
import { baseColumns } from './baseColumns.js'; 

export const Incident = new EntitySchema({
  name: 'Incident', 
  tableName: 'incidents', 
  columns: {
    ...baseColumns, 
    /** 
    id: {
      type: 'uuid', 
      primary: true, 
      generated: true, 
    }, 
    */
    incidentNumber: {
      name: 'incident_number',
      type: 'varchar',
      length: 50,
      nullable: true, 
      /** Generate this in a service or dedicated numbering mechanism. */
    }, 
    incidentType: {
      name: 'incident_type', 
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'suspicious_activity',   // theft, trespass, medical, fire, property_damage, suspicious_activity, other
    }, 
    severity: {
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'high',   // low, medium, high, critical 
    }, 
    title: {
      type: 'varchar', 
      length: 200, 
      nullable: false, 
    }, 
    description: {
      type: 'text', 
      nullable: true, 
      /** May be incomplete while an incident is a draft. */
    }, 
    occurredAt: {
      name: 'occurred_at', 
      type: 'timestamptz',
      nullable: true,
    }, 
    /** Actual or approximate location. */
    latitude: {
      type: 'numeric', 
      precision: 10, 
      scale: 7, 
      nullable: true,
    }, 
    longitude: {
      type: 'numeric', 
      precision: 10, 
      scale: 7, 
      nullable: true,
    }, 
    locationDescription: {
      name: 'location_description',
      type: 'varchar',
      length: 255,
      nullable: true,
    },  
    status: {
      type: 'varchar', 
      length: 50, 
      nullable: false, 
      default: 'draft',   // draft, submitted, under_review, closed
    }, 
    reviewOutcome: {
      name: 'review_outcome',
      type: 'varchar',
      length: 50,
      nullable: true, 
      /** Optional review decision, e.g. confirmed, unsubstantiated, duplicate, or no_further_action. */
    },
    reviewedByUserId: {
      name: 'reviewed_by',
      type: 'uuid',
      nullable: true, 
      /** 
      foreignKey: { 
        target: "users", // User
       }, 
       */
    }, 
    reviewedAt: {
      name: 'reviewed_at', 
      type: 'timestamptz',
      nullable: true,
    }, 
    closedAt: {
      name: 'closed_at',
      type: 'timestamptz',
      nullable: true,
    }, 
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false, 
      /** Required reporting officer. */
    }, 
    shiftId: {
      name: 'shift_id',
      type: 'uuid',
      nullable: true, 
      /** A reported incident may not be associated with a shift. */
    }, 
    siteId: {
      name: 'site_id',
      type: 'uuid',
      nullable: false, 
      /** Required site where the incident was reported to have occurred. */
    }, 
    emergencyAlertId: {
      name: 'emergency_alert_id',
      type: 'uuid',
      nullable: true,
    },
  }, 
  relations: {
    reviewedByUser: {
      type: 'many-to-one',
      target: 'User', 
      joinColumn: {
        name: 'reviewed_by',
        referencedColumnName: 'id',
      },
      nullable: true, 
      onDelete: 'RESTRICT', 
    }, 
    officer: {
      type: 'many-to-one',
      target: 'Officer', 
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      nullable: true, 
      onDelete: 'RESTRICT', 
    }, 
    shift: {
      type: 'many-to-one',
      target: 'Shift', 
      joinColumn: {
        name: 'shift_id',
        referencedColumnName: 'id',
      },
      nullable: true, 
      onDelete: 'RESTRICT', 
    }, 
    site: {
      type: 'many-to-one',
      target: 'Site', 
      joinColumn: {
        name: 'site_id',
        referencedColumnName: 'id',
      },
      nullable: true, 
      onDelete: 'RESTRICT', 
    }, 
    emergencyAlert: {
      type: 'many-to-one',
      target: 'EmergencyAlert',
      joinColumn: {
        name: 'emergency_alert_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    }, 
    incidentEvents: {
      type: 'one-to-many',
      target: 'IncidentEvent',
      inverseSide: 'incident',
    }, 
    incidentNotifications: {
      type: 'one-to-many',
      target: 'IncidentNotification',
      inverseSide: 'incident',
    },
  },
  indices: [
    {
      name: 'UQ_INCIDENTS_INCIDENT_NUMBER',
      columns: ['incidentNumber'],
      unique: true,
    },
    {
      name: 'IDX_INCIDENTS_STATUS_OCCURRED',
      columns: ['status', 'occurredAt'],
    },
    {
      name: 'IDX_INCIDENTS_TYPE_OCCURRED',
      columns: ['incidentType', 'occurredAt'],
    },
    {
      name: 'IDX_INCIDENTS_SEVERITY_STATUS',
      columns: ['severity', 'status'],
    },
    {
      name: 'IDX_INCIDENTS_OFFICER_ID',
      columns: ['officerId'],
    },
    {
      name: 'IDX_INCIDENTS_SHIFT_ID',
      columns: ['shiftId'],
    },
    {
      name: 'IDX_INCIDENTS_SITE_OCCURRED',
      columns: ['siteId', 'occurredAt'],
    },
    {
      name: 'IDX_INCIDENTS_REVIEWED_BY',
      columns: ['reviewedByUserId'],
    },
  ],
});