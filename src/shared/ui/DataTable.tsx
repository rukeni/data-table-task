import type { Key } from 'react';
import type { ColumnsType } from 'antd/es/table';

import dayjs from 'dayjs';
import React, { useState, useMemo } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, Button, Table, Modal } from 'antd';

import { useStore } from '@/store';
import { RecordForm } from '@/shared/ui/RecordForm';
import { FieldValue, Record, Field } from '@/store/memberSlice';

const formatValue = (value: FieldValue, type: string): string => {
  if (value === undefined || value === null) {
    return '';
  }
  if (type === 'date' && value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DD');
  }
  if (type === 'checkbox') {
    return (value as boolean) ? '선택됨' : '선택 안함';
  }
  return String(value);
};

export const DataTable: React.FC = () => {
  const { fields, records, deleteRecord, updateRecord } = useStore();
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const columns: ColumnsType<Record> = useMemo(
    () => [
      ...fields.map((field: Field) => ({
        width:
          field.label === '이름'
            ? 120
            : field.label === '가입일'
              ? 200
              : field.label === '이메일 수신 동의'
                ? 150
                : undefined,
        title: field.label,
        key: field.label,
        dataIndex: field.label,
        onFilter: (value: boolean | Key, record: Record) =>
          formatValue(record[field.label], field.type) === value,
        filters: Array.from(
          new Set(records.map((r: Record) => formatValue(r[field.label], field.type))),
        ).map((value) => ({
          value,
          text: value,
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
          return formatValue(value, field.type);
        },
      })),
      {
        width: 48,
        title: '',
        key: 'action',
        render: (_: unknown, record: Record) => (
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
