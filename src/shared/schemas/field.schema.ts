import { z } from 'zod';
import dayjs from 'dayjs';

const MAX_TEXT_LENGTH = 20;
const MAX_TEXTAREA_LENGTH = 50;

const fieldTypes = ['text', 'textarea', 'date', 'select', 'checkbox'] as const;
export const fieldTypeSchema = z.enum(fieldTypes);

export const baseFieldSchema = z.object({
  id: z.string().min(1, 'ID는 필수입니다.'),
  type: fieldTypeSchema,
  label: z.string().min(1, '라벨은 필수입니다.'),
  required: z.boolean(),
});

export const textFieldSchema = baseFieldSchema.extend({
  type: z.literal('text'),
});

export const textAreaFieldSchema = baseFieldSchema.extend({
  type: z.literal('textarea'),
});

export const dateFieldSchema = baseFieldSchema.extend({
  type: z.literal('date'),
});

export const selectFieldSchema = baseFieldSchema.extend({
  type: z.literal('select'),
  options: z.array(z.string()).min(1, '최소 1개의 옵션이 필요합니다.'),
});

export const checkboxFieldSchema = baseFieldSchema.extend({
  type: z.literal('checkbox'),
});

export const fieldSchema = z.discriminatedUnion('type', [
  textFieldSchema,
  textAreaFieldSchema,
  dateFieldSchema,
  selectFieldSchema,
  checkboxFieldSchema,
]);

// 필드 값 검증을 위한 스키마
export const createFieldValueSchema = (field: z.infer<typeof fieldSchema>) => {
  const baseSchema = z.object({
    fieldId: z.string().min(1, 'fieldId는 필수입니다.'),
  });

  let valueSchema: z.ZodType;

  switch (field.type) {
    case 'textarea':
      valueSchema = z
        .string()
        .max(MAX_TEXTAREA_LENGTH, `글자수 ${MAX_TEXTAREA_LENGTH}을 초과할 수 없습니다.`);
      break;
    case 'checkbox':
      valueSchema = z.boolean();
      break;
    case 'select':
      valueSchema = z
        .string()
        .refine((value) => field.options.includes(value), { message: '유효한 옵션이 아닙니다.' });
      break;
    case 'text':
      valueSchema = z
        .string()
        .max(MAX_TEXT_LENGTH, `글자수 ${MAX_TEXT_LENGTH}을 초과할 수 없습니다.`);
      break;
    case 'date':
      valueSchema = z.custom((data) => dayjs.isDayjs(data), {
        message: '올바른 날짜 형식이 아닙니다.',
      });
      break;
    default:
      valueSchema = z.unknown();
  }

  return baseSchema.extend({
    value: field.required ? valueSchema : valueSchema.optional(),
  });
};
