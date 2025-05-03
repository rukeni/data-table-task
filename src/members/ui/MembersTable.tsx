import type { Key } from 'react';
import type { ColumnsType } from 'antd/es/table';

import type { BaseField } from '@/shared/types/field';
import type { FieldValue, Record } from '@/shared/types/record';

import dayjs from 'dayjs';
import { MoreOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, Button } from 'antd';
import React, { useState, useMemo, JSX } from 'react';

import { useStore } from '@/store';
import { Table } from '@/shared/ui/Table';
import matchPattern from '@/shared/utils/matchPattern';

import { MemberForm } from './MemberForm';

const formatValue = (value: FieldValue, type: string): string => {
  return matchPattern<string>({
    defaultValue: String(value ?? ''),
    cases: [
      {
        then: '',
        when: value === undefined || value === null,
      },
      {
        when: type === 'date' && value instanceof Date,
        then: () => dayjs(value as Date).format('YYYY-MM-DD'),
      },
      {
        when: type === 'checkbox',
        then: (value as boolean) ? '선택됨' : '선택 안함',
      },
    ],
  });
};

const getColumnWidth = (fieldLabel: string): undefined | number => {
  return matchPattern<undefined | number>({
    defaultValue: undefined,
    cases: [
      {
        then: 120,
        when: fieldLabel === '이름',
      },
      {
        then: 200,
        when: fieldLabel === '가입일',
      },
      {
        then: 150,
        when: fieldLabel === '이메일 수신 동의',
      },
    ],
  });
};

export const MembersTable: React.FC = () => {
  const { fields, records, deleteRecord, updateRecord } = useStore();
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (record: Record | null) => {
    setEditingRecord(record);
    setIsModalVisible(!!record);
  };

  const columns: ColumnsType<Record> = useMemo(
    () => [
      ...fields.map((field: BaseField) => ({
        width: getColumnWidth(field.label),
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
          return matchPattern<JSX.Element | string>({
            defaultValue: formatValue(value, field.type),
            cases: [
              {
                when: field.type === 'checkbox',
                then: (
                  <Checkbox
                    onChange={(e) => updateRecord(record.id, { [field.label]: e.target.checked })}
                    checked={value as boolean}
                  />
                ),
              },
            ],
          });
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
                  onClick: () => handleEdit(record),
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

  return (
    <Table<Record>
      onEdit={handleEdit}
      recordFormComponent={MemberForm}
      pageSize={10}
      records={records}
      columns={columns}
      editingRecord={editingRecord}
      isModalVisible={isModalVisible}
    />
  );
};
