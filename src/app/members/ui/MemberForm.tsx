import type { Rule } from 'antd/es/form';

import type {
  Field as ValidationField,
  TextAreaField,
  CheckboxField,
  SelectField,
  TextField,
  DateField,
} from '@/shared/types/field';

import React from 'react';
import { DatePicker, Checkbox, Select, Input } from 'antd';

import { useStore } from '@/store';
import { Form } from '@/shared/ui/Form';
import { Record, Field } from '@/store/memberSlice';
import { validateFieldValue } from '@/utils/validation';

const { TextArea } = Input;

interface MemberFormProps {
  record?: Record;
  onClose: () => void;
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

const convertToValidationField = (field: Field): ValidationField => {
  const baseField = {
    id: `${field.type}-${field.label}`,
    label: field.label,
    required: field.required,
  };

  switch (field.type) {
    case 'textarea':
      return {
        ...baseField,
        type: 'textarea',
      } as TextAreaField;
    case 'checkbox':
      return {
        ...baseField,
        type: 'checkbox',
      } as CheckboxField;
    case 'select':
      return {
        ...baseField,
        type: 'select',
        options: ['개발자', 'PO', '디자이너'], // 하드코딩된 옵션들을 상수로 분리하는 것이 좋습니다
      } as SelectField;
    case 'text':
      return {
        ...baseField,
        type: 'text',
      } as TextField;
    case 'date':
      return {
        ...baseField,
        type: 'date',
      } as DateField;
    default:
      throw new Error(`Unsupported field type: ${field.type}`);
  }
};

const getFieldRules = (field: Field): Rule[] => {
  const rules: Rule[] = [];

  // 기본 required 규칙
  if (field.required) {
    rules.push({
      required: true,
      message:
        field.label === '이름' ? '이름은 필수값입니다.' : `${field.label}을(를) 입력해주세요.`,
    });
  }

  // 타입별 검증 규칙
  rules.push({
    validator: async (_, value) => {
      const validationField = convertToValidationField(field);
      const result = validateFieldValue({ fieldId: validationField.id, value }, validationField);

      if (!result.success) {
        throw new Error(result.errors[0]?.message || '유효하지 않은 값입니다.');
      }
    },
  });
  return rules;
};

export const MemberForm: React.FC<MemberFormProps> = ({ record, onClose }) => {
  const { fields, addRecord, updateRecord } = useStore();

  return (
    <Form
      onClose={onClose}
      record={record}
      fields={fields}
      addRecord={addRecord}
      renderField={renderField}
      updateRecord={updateRecord}
      getFieldRules={getFieldRules}
    />
  );
};
