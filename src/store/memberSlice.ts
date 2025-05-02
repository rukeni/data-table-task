import dayjs from 'dayjs';
import { StateCreator } from 'zustand';

export interface Field {
  type: FieldType;
  label: string;
  required: boolean;
}

// Types
export type FieldType = 'textarea' | 'checkbox' | 'select' | 'text' | 'date';

export interface Record {
  id: string;
  [key: string]: FieldValue;
}

export type FieldValue = boolean | string | Date;

// Validation
export const FIELD_VALIDATIONS = {
  date: {},
  select: {},
  checkbox: {},
  text: { maxLength: 20 },
  textarea: { maxLength: 50 },
} as const;

// Date utils
export const serializeDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const deserializeDate = (dateStr: string): Date => {
  return dayjs(dateStr).toDate();
};

export const processRecordForStorage = (record: Record): Record => {
  const processed = { ...record };
  Object.entries(processed).forEach(([key, value]) => {
    if (value instanceof Date) {
      processed[key] = serializeDate(value);
    }
  });
  return processed;
};

export const processRecordFromStorage = (record: Record): Record => {
  const processed = { ...record };
  const dateFields = DEFAULT_FIELDS.filter((field) => field.type === 'date').map(
    (field) => field.label,
  );

  Object.entries(processed).forEach(([key, value]) => {
    if (dateFields.includes(key) && typeof value === 'string') {
      processed[key] = deserializeDate(value);
    }
  });
  return processed;
};

// Constants
export const DEFAULT_FIELDS: Field[] = [
  { type: 'text', label: '이름', required: true },
  { type: 'text', label: '주소', required: false },
  { type: 'textarea', label: '메모', required: false },
  { type: 'date', label: '가입일', required: true },
  { type: 'select', label: '직업', required: false },
  { type: 'checkbox', label: '이메일 수신 동의', required: false },
];

export const DEFAULT_RECORDS: Record[] = [
  {
    id: '1',
    메모: '외국인',
    직업: '개발자',
    주소: '서울 강남구',
    이름: 'John Doe',
    '이메일 수신 동의': true,
    가입일: deserializeDate('2024-10-02'),
  },
  {
    id: '2',
    직업: 'PO',
    메모: '한국인',
    주소: '서울 서초구',
    이름: 'Foo Bar',
    '이메일 수신 동의': false,
    가입일: deserializeDate('2024-10-01'),
  },
];

// Helper function for generating unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export interface MemberSlice {
  fields: Field[];
  records: Record[];
  addField: (field: Field) => void;
  deleteRecord: (id: string) => void;
  setFields: (fields: Field[]) => void;
  deleteField: (index: number) => void;
  setRecords: (records: Record[]) => void;
  addRecord: (record: Omit<Record, 'id'>) => void;
  updateField: (index: number, field: Field) => void;
  updateRecord: (id: string, updates: Partial<Record>) => void;
}

export const createMemberSlice: StateCreator<MemberSlice> = (set, get) => ({
  fields: DEFAULT_FIELDS,
  records: DEFAULT_RECORDS,

  setFields: (fields) => {
    set({ fields });
  },

  addField: (field) => {
    const fields = [...get().fields, field];
    set({ fields });
  },

  deleteRecord: (id) => {
    const records = get().records.filter((r) => r.id !== id);
    set({ records });
  },

  deleteField: (index) => {
    const fields = get().fields.filter((_, i) => i !== index);
    set({ fields });
  },

  updateField: (index, field) => {
    const fields = [...get().fields];
    fields[index] = field;
    set({ fields });
  },

  addRecord: (record) => {
    const records = [...get().records, { ...record, id: generateId() }];
    set({ records });
  },

  setRecords: (records) => {
    const processedRecords = records.map(processRecordFromStorage);
    set({ records: processedRecords });
  },

  updateRecord: (id, updates) => {
    const records = get().records.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r };
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          updated[key] = value;
        }
      });
      return updated;
    });
    set({ records });
  },
});
