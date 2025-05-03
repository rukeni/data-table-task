import type { Key } from 'react';

import type { TableProps } from '../types/table';

import React, { useState } from 'react';
import { Table as AntDesignTable } from 'antd';

import { Modal } from './Modal';

export const Table = <T extends { id: string }>({
  onEdit,
  records,
  columns,
  editingRecord,
  rowKey = 'id',
  pageSize = 10,
  isModalVisible = false,
  recordFormComponent: RecordFormComponent,
}: TableProps<T>): React.ReactElement => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      <AntDesignTable
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
