import type { Key } from 'react';
import type { ColumnsType } from 'antd/es/table';

import { Table, Modal } from 'antd';
import React, { useState } from 'react';

export interface DataTableProps<T> {
  records: T[];
  rowKey?: string;
  pageSize?: number;
  columns: ColumnsType<T>;
  editingRecord?: null | T;
  isModalVisible?: boolean;
  onEdit?: (record: null | T) => void;
  recordFormComponent?: React.FC<{
    onClose: () => void;
    record: T;
  }>;
}

export const DataTable = <T extends { id: string }>({
  onEdit,
  records,
  columns,
  editingRecord,
  rowKey = 'id',
  pageSize = 10,
  isModalVisible = false,
  recordFormComponent: RecordFormComponent,
}: DataTableProps<T>): React.ReactElement => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      <Table
        rowKey={rowKey}
        pagination={{ pageSize }}
        rowSelection={rowSelection}
        dataSource={records}
        columns={columns}
      />
      {RecordFormComponent && editingRecord && (
        <Modal
          onCancel={() => {
            if (onEdit) {
              onEdit(null);
            }
          }}
          footer={null}
          title="레코드 수정"
          open={isModalVisible}
        >
          <RecordFormComponent
            onClose={() => {
              if (onEdit) {
                onEdit(null);
              }
            }}
            record={editingRecord}
          />
        </Modal>
      )}
    </>
  );
};
