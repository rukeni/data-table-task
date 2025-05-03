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
  const [formValid, setFormValid] = React.useState(false);
  const [isFieldsTouched, setIsFieldsTouched] = React.useState(false);

  // 폼 값이 변경될 때마다 유효성 검사
  const validateForm = async () => {
    try {
      const values = form.getFieldsValue();
      const requiredFields = fields.filter((field) =>
        getFieldRules(field).some(
          (rule) => typeof rule === 'object' && 'required' in rule && rule.required,
        ),
      );

      // 필수 필드만 체크
      const hasAllRequiredFields =
        requiredFields.length > 0 &&
        requiredFields.every((field) => {
          const value = values[field.label];
          if (value === undefined || value === null) return false;
          if (dayjs.isDayjs(value)) return true;
          if (value instanceof Date) return true;
          return String(value).trim() !== '';
        });

      setFormValid(hasAllRequiredFields);
    } catch {
      setFormValid(false);
    }
  };

  const onValuesChange = () => {
    setIsFieldsTouched(true);
    validateForm();
  };

  // 초기값이 있는 경우 validation 수행
  React.useEffect(() => {
    if (record) {
      validateForm();
    }
  }, [record]);

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
    <AntDesignForm
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      form={form}
      layout="vertical"
      initialValues={initialValues}
    >
      {fields.map((field) => (
        <AntDesignForm.Item
          key={field.label}
          validateStatus={!isFieldsTouched ? '' : undefined}
          valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
          name={field.label}
          label={field.label}
          rules={getFieldRules(field)}
        >
          {renderField(field)}
        </AntDesignForm.Item>
      ))}
      <AntDesignForm.Item style={{ textAlign: 'right' }}>
        <AntDesignButton onClick={onClose}>취소</AntDesignButton>
        <AntDesignButton
          type="primary"
          disabled={!formValid}
          style={{ marginLeft: '8px' }}
          htmlType="submit"
        >
          {record ? '수정' : '추가'}
        </AntDesignButton>
      </AntDesignForm.Item>
    </AntDesignForm>
  );
};
