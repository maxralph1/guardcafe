export const baseColumns = {
  id: {
    type: 'uuid',
    primary: true,
    // generated: true
    generated: 'uuid',
  },
  createdAt: {
    name: 'created_at',
    type: 'timestamptz',
    createDate: true,
  },
  updatedAt: {
    name: 'updated_at',
    type: 'timestamptz',
    updateDate: true,
  },
  deletedAt: {
    name: 'deleted_at',
    type: 'timestamptz',
    deleteDate: true,
    nullable: true,
  },
};
