import type { Rule } from 'antd/es/form';

import React from 'react';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Button, Form } from 'antd';

import { FieldValue, Record, Field } from '@/store/memberSlice';

export interface RecordFormProps {
  record?: Record;
  fields: Field[];
  onClose: () => void;
  getFieldRules: (field: Field) => Rule[];
  renderField: (field: Field) => React.ReactNode;
  addRecord: (record: Omit<Record, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<Record>) => void;
}

interface FormValues {
  [key: string]: FieldValue | Dayjs;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  record,
  fields,
  onClose,
  addRecord,
  renderField,
  updateRecord,
  getFieldRules,
}) => {
  const [form] = Form.useForm<FormValues>();

  const onFinish = (values: FormValues) => {
    const processedValues = Object.entries(values).reduce((acc, [key, value]) => {
      const field = fields.find((f) => f.label === key);
      if (!field) return acc;

      if (field.type === 'date' && value) {
        return { ...acc, [key]: (value as Dayjs).toDate() };
      }
      return { ...acc, [key]: value };
    }, {});

    if (record) {
      updateRecord(record.id, processedValues);
    } else {
      addRecord(processedValues);
    }
    onClose();
  };

  const initialValues = record
    ? Object.entries(record).reduce((acc, [key, value]) => {
        if (key === 'id') return acc;
        const field = fields.find((f) => f.label === key);
        if (!field) return acc;

        if (field.type === 'date' && value instanceof Date) {
          return { ...acc, [key]: dayjs(value) };
        }
        return { ...acc, [key]: value };
      }, {})
    : {};

  return (
    <Form onFinish={onFinish} form={form} layout="vertical" initialValues={initialValues}>
      {fields.map((field) => (
        <Form.Item
          key={field.label}
          valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
          name={field.label}
          label={field.label}
          rules={getFieldRules(field)}
        >
          {renderField(field)}
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {record ? '수정' : '추가'}
        </Button>
      </Form.Item>
    </Form>
  );
};
