import type { FormValues, FormProps } from '../types/form';

import React from 'react';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Button as AntDesignButton, Form as AntDesignForm } from 'antd';

export const Form: React.FC<FormProps> = ({
  record,
  fields,
  onClose,
  addRecord,
  renderField,
  updateRecord,
  getFieldRules,
}) => {
  const [form] = AntDesignForm.useForm<FormValues>();

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
    <AntDesignForm onFinish={onFinish} form={form} layout="vertical" initialValues={initialValues}>
      {fields.map((field) => (
        <AntDesignForm.Item
          key={field.label}
          valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
          name={field.label}
          label={field.label}
          rules={getFieldRules(field)}
        >
          {renderField(field)}
        </AntDesignForm.Item>
      ))}
      <AntDesignForm.Item>
        <AntDesignButton type="primary" htmlType="submit">
          {record ? '수정' : '추가'}
        </AntDesignButton>
      </AntDesignForm.Item>
    </AntDesignForm>
  );
};
