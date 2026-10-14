import { EntitySchema } from 'typeorm';
import { baseColumns } from './baseColumns.js';
import { User } from './User.js';
import { Officer } from './Officer.js';

/**
 * General documents (contract, ID copy, background check)
 */
export const OfficerDocument = new EntitySchema({
  name: 'OfficerDocument',
  tableName: 'officer_documents',
  columns: {
    ...baseColumns,
    type: {
      name: 'type',
      type: 'varchar',
      length: 100,
      default: '', // ...
    },
    fileName: {
      name: 'file_name',
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    fileUrl: {
      name: 'file_url',
      type: 'text',
      nullable: true,
    },
    officerId: {
      name: 'officer_id',
      type: 'uuid',
      nullable: false,
    },
    uploadedBy: {
      name: 'uploaded_by',
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    officer: {
      type: 'many-to-one',
      target: Officer,
      joinColumn: {
        name: 'officer_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
      nullable: false,
    },
    uploader: {
      type: 'many-to-one',
      target: User,
      joinColumn: {
        name: 'uploaded_by',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
      nullable: false,
    },
  },
  indices: [
    {
      name: 'IDX_OFFICER_CREDENTIALS_ID',
      columns: ['id'],
      unique: true,
    },
    {
      name: 'IDX_OFFICER_CREDENTIALS_OFFICER_ID',
      columns: ['officerId'],
      unique: false,
    },
  ],
});
