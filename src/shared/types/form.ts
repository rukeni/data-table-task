import { Dayjs } from 'dayjs';
import { Rule } from 'antd/es/form';

import { Record } from './record';
import { FieldValue, BaseField } from './field';

export interface FormProps {
  record?: Record;
  fields: BaseField[];
  onClose: () => void;
  getFieldRules: (field: BaseField) => Rule[];
  addRecord: (record: Omit<Record, 'id'>) => void;
  renderField: (field: BaseField) => React.ReactNode;
  updateRecord: (id: string, updates: Partial<Record>) => void;
}

export interface FormValues {
  [key: string]: FieldValue | Dayjs;
}
