import type { Key } from 'react';
import type { ColumnsType } from 'antd/es/table';

import dayjs from 'dayjs';
import React, { useState, useMemo } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, Button, Table, Modal } from 'antd';

import { RecordForm } from '@/shared/ui/RecordForm';
import { FieldValue, useStore, Record } from '@/store/memberSlice';

export const DataTable: React.FC = () => {
  const { fields, records, deleteRecord, updateRecord } = useStore();
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const columns: ColumnsType<Record> = useMemo(
    () => [
      ...fields.map((field) => ({
        title: field.label,
        key: field.label,
        dataIndex: field.label,
        onFilter: (value: boolean | Key, record: Record) =>
          String(record[field.label]) === String(value),
        filters: Array.from(new Set(records.map((r) => r[field.label]))).map((value) => ({
          value: String(value),
          text:
            field.type === 'date'
              ? dayjs(value as Date).format('YYYY-MM-DD')
              : field.type === 'checkbox'
                ? value
                  ? '선택됨'
                  : '선택 안함'
                : String(value),
        })),
        render: (value: FieldValue, record: Record) => {
          if (field.type === 'checkbox') {
            return (
              <Checkbox
                onChange={(e) => updateRecord(record.id, { [field.label]: e.target.checked })}
                checked={value as boolean}
              />
            );
          }
          if (value instanceof Date) {
            return dayjs(value).format('YYYY-MM-DD');
          }
          return value;
        },
      })),
      {
        width: 80,
        title: '',
        key: 'action',
        render: (_, record) => (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  label: '수정',
                  key: 'edit',
                  onClick: () => {
                    setEditingRecord(record);
                    setIsModalVisible(true);
                  },
                },
                {
                  label: '삭제',
                  danger: true,
                  key: 'delete',
                  onClick: () => deleteRecord(record.id),
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    ],
    [fields, records, deleteRecord, updateRecord],
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{ pageSize: 10 }}
        dataSource={records}
        columns={columns}
      />
      <Modal
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        footer={null}
        title="레코드 수정"
        open={isModalVisible}
      >
        {editingRecord && (
          <RecordForm
            onClose={() => {
              setIsModalVisible(false);
              setEditingRecord(null);
            }}
            record={editingRecord}
          />
        )}
      </Modal>
    </>
  );
};
