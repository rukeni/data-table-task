import type { Rule } from 'antd/es/form';

import React from 'react';
import { DatePicker, Checkbox, Select, Input } from 'antd';

import { useStore } from '@/store';
import { Record, Field } from '@/store/memberSlice';
import { RecordForm } from '@/shared/ui/RecordForm';

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

const getFieldRules = (field: Field): Rule[] => {
  const rules: Rule[] = [
    {
      required: field.required,
      message:
        field.label === '이름' ? '이름은 필수값입니다.' : `${field.label}을(를) 입력해주세요.`,
    },
  ];

  if (field.type === 'text' && field.label === '주소') {
    rules.push({
      max: 20,
      message: '글자수 20을 초과할 수 없습니다.',
    });
  }

  if (field.type === 'textarea' && field.label === '메모') {
    rules.push({
      max: 50,
      message: '글자수 50을 초과할 수 없습니다.',
    });
  }

  return rules;
};

export const MemberForm: React.FC<MemberFormProps> = ({ record, onClose }) => {
  const { fields, addRecord, updateRecord } = useStore();

  return (
    <RecordForm
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
