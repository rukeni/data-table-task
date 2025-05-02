import React from 'react';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { DatePicker, Checkbox, Select, Button, Input, Form } from 'antd';

import { useStore } from '@/store';
import { FieldValue, Record, Field } from '@/store/memberSlice';

const { TextArea } = Input;

interface RecordFormProps {
  record?: Record;
  onClose: () => void;
}

interface FormValues {
  [key: string]: FieldValue | Dayjs;
}

const renderField = (field: Field) => {
  switch (field.type) {
    case 'textarea':
      return <TextArea showCount />;
    case 'checkbox':
      return <Checkbox />;
    case 'select':
      return (
        <Select>
          <Select.Option value="개발자">개발자</Select.Option>
          <Select.Option value="PO">PO</Select.Option>
          <Select.Option value="디자이너">디자이너</Select.Option>
        </Select>
      );
    case 'text':
      return <Input showCount />;
    case 'date':
      return <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />;
    default:
      return null;
  }
};

export const RecordForm: React.FC<RecordFormProps> = ({ record, onClose }) => {
  const { fields, addRecord, updateRecord } = useStore();
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
          rules={[
            {
              required: field.required,
              message:
                field.label === '이름'
                  ? '이름은 필수값입니다.'
                  : `${field.label}을(를) 입력해주세요.`,
            },
            ...(field.type === 'text' && field.label === '주소'
              ? [
                  {
                    max: 20,
                    message: '글자수 20을 초과할 수 없습니다.',
                  },
                ]
              : []),
            ...(field.type === 'textarea' && field.label === '메모'
              ? [
                  {
                    max: 50,
                    message: '글자수 50을 초과할 수 없습니다.',
                  },
                ]
              : []),
          ]}
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
