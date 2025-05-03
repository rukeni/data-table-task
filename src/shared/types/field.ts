export type FieldValueType<T extends Field> = T extends TextField
  ? string
  : T extends TextAreaField
    ? string
    : T extends DateField
      ? string
      : T extends SelectField
        ? string
        : T extends CheckboxField
          ? boolean
          : never;

export interface TypedFieldValue<T extends Field> {
  fieldId: string;
  value: T['required'] extends true ? FieldValueType<T> : FieldValueType<T> | undefined;
}

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: string[];
}

export type Field = TextAreaField | CheckboxField | SelectField | TextField | DateField;

export type FieldType = 'textarea' | 'checkbox' | 'select' | 'text' | 'date';

export interface TextAreaField extends BaseField {
  type: 'textarea';
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
}

// 기존 FieldValue 인터페이스는 하위 호환성을 위해 유지
export interface FieldValue {
  fieldId: string;
  value: unknown;
}

export interface TextField extends BaseField {
  type: 'text';
}

export interface DateField extends BaseField {
  type: 'date';
}

// Type Guards
export const isTextField = (field: Field): field is TextField => field.type === 'text';
export const isTextAreaField = (field: Field): field is TextAreaField => field.type === 'textarea';
export const isDateField = (field: Field): field is DateField => field.type === 'date';
export const isSelectField = (field: Field): field is SelectField => field.type === 'select';
export const isCheckboxField = (field: Field): field is CheckboxField => field.type === 'checkbox';
