import { EntitySchema } from 'typeorm'; 
import { baseColumns } from './baseColumns.js'; 

/**
 * Licenses, permits, certifications, and other officer credentials.
 *
 * Verification, expiry, and revocation are separate concepts:
 * - verificationStatus describes the review outcome;
 * - expiryDate describes the credential's validity period;
 * - revokedAt records early revocation.
 */
export const OfficerCredential = new EntitySchema({
  name: 'OfficerCredential', 
  tableName: 'officer_credentials', 
  columns: {
    ...baseColumns, 
    type: {
      name: 'type',
      type: 'varchar', 
      length: 100,
      nullable: false,   // armed_permit, first_aid, cpr, drivers_license, guard_license, international_passport, national_id, other
    }, 
    credentialNumber: {
      name: 'credential_number', 
      type: 'varchar', 
      length: 100, 
      nullable: true, 
    }, 
    issuingAuthority: {
      name: 'issuing_authority', 
      type: 'varchar', 
      length: 200, 
      nullable: true, 
    }, 
    issuedDate: {
      name: 'issued_date',
      type: 'date',
      nullable: true,
    }, 
    expiryDate: {
      name: 'expiry_date',
      type: 'date',
      nullable: true,
    }, 
    verificationStatus: {
      name: 'verification_status',
      type: 'varchar',
      length: 30,
      nullable: false,
      default: 'pending',
    }, 
    verifiedAt: {
      name: 'verified_at',
      type: 'timestamptz',
      nullable: true,
    }, 
    verifiedByUserId: {
      name: 'verified_by_user_id',
      type: 'uuid',
      nullable: true,
    }, 
    rejectionReason: {
      name: 'rejection_reason',
      type: 'text',
      nullable: true,
    },
    revokedAt: {
      name: 'revoked_at',
      type: 'timestamptz',
      nullable: true,
    }, 
    revocationReason: {
      name: 'revocation_reason',
      type: 'text',
      nullable: true,
    }, 
    documentStorageKey: {
      name: 'document_storage_key',
      type: 'varchar',
      length: 1024,
      nullable: true,
    },
    documentFileName: {
      name: 'document_file_name',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    documentMimeType: {
      name: 'document_mime_type',
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    documentSizeBytes: {
      name: 'document_size_bytes',
      type: 'bigint',
      nullable: true,
    },
    documentSha256: {
      name: 'document_sha256',
      type: 'varchar',
      length: 64,
      nullable: true,
    },
    documentUrl: {
      name: 'document_url', 
      type: 'text', 
      nullable: true,
    }, 
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
  }, 
  relations: {
    officer: {
      type: 'many-to-one',
      target: 'Officer', 
      inverseSide: 'officerCredentials',
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      nullable: false, 
      onDelete: 'RESTRICT', 
    }, 
    verifiedByUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'verified_by_user_id',
        referencedColumnName: 'id',
      },
      nullable: true,
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'IDX_OFFICER_CREDENTIALS_OFFICER',
      columns: ['officerId'],
    },
    {
      name: 'IDX_OFFICER_CREDENTIALS_EXPIRY',
      columns: ['expiryDate'],
    },
    {
      name: 'IDX_OFFICER_CREDENTIALS_VERIFICATION',
      columns: ['verificationStatus', 'createdAt'],
    },
    {
      name: 'IDX_OFFICER_CREDENTIALS_VERIFIED_BY',
      columns: ['verifiedByUserId'],
    },
  ],
});