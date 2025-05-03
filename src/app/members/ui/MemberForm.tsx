import type { Rule } from 'antd/es/form';

import type {
  Field as ValidationField,
  TextAreaField,
  CheckboxField,
  SelectField,
  TextField,
  DateField,
  BaseField,
} from '@/shared/types/field';

import React, { JSX } from 'react';
import { DatePicker, Checkbox, Select, Input } from 'antd';

import { useStore } from '@/store';
import { Form } from '@/shared/ui/Form';
import { Record } from '@/shared/types/record';
import matchPattern from '@/shared/utils/matchPattern';
import { validateFieldValue } from '@/shared/utils/validation';

const { TextArea } = Input;

interface MemberFormProps {
  record?: Record;
  onClose: () => void;
}

const renderField = (field: BaseField) => {
  return matchPattern<JSX.Element | null>({
    defaultValue: null,
    cases: [
      {
        then: <TextArea showCount />,
        when: field.type === 'textarea',
      },
      {
        then: <Checkbox />,
        when: field.type === 'checkbox',
      },
      {
        when: field.type === 'select',
        then: (
          <Select>
            <Select.Option value="개발자">개발자</Select.Option>
            <Select.Option value="PO">PO</Select.Option>
            <Select.Option value="디자이너">디자이너</Select.Option>
          </Select>
        ),
      },
      {
        then: <Input showCount />,
        when: field.type === 'text',
      },
      {
        when: field.type === 'date',
        then: <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />,
      },
    ],
  });
};

const convertToValidationField = (field: BaseField): ValidationField => {
  const baseField = {
    id: `${field.type}-${field.label}`,
    label: field.label,
    required: field.required,
  };

  return matchPattern<ValidationField>({
    defaultValue: {
      ...baseField,
      type: 'text',
    } as TextField,
    cases: [
      {
        when: field.type === 'textarea',
        then: {
          ...baseField,
          type: 'textarea',
        } as TextAreaField,
      },
      {
        when: field.type === 'checkbox',
        then: {
          ...baseField,
          type: 'checkbox',
        } as CheckboxField,
      },
      {
        when: field.type === 'select',
        then: {
          ...baseField,
          type: 'select',
          options: ['개발자', 'PO', '디자이너'],
        } as SelectField,
      },

      {
        when: field.type === 'date',
        then: {
          ...baseField,
          type: 'date',
        } as DateField,
      },
    ],
  });
};

const getFieldRules = (field: BaseField): Rule[] => {
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
