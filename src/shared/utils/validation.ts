import type { ValidationResult } from '@/shared/types/validation';
import type { TypedFieldValue, Field } from '@/shared/types/field';

import { z } from 'zod';

import { createFieldValueSchema, fieldSchema } from '@/shared/schemas/field.schema';

export const validateField = (field: unknown): ValidationResult<Field> => {
  try {
    const validatedField = fieldSchema.parse(field) as Field;
    return {
      errors: [],
      success: true,
      data: validatedField,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path,
          code: err.code,
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [
        {
          path: [],
          code: 'UNKNOWN_ERROR',
          message: '알 수 없는 오류가 발생했습니다.',
        },
      ],
    };
  }
};

export const validateFieldValue = <T extends Field>(
  fieldValue: unknown,
  field: T,
): ValidationResult<TypedFieldValue<T>> => {
  try {
    const schema = createFieldValueSchema(field);
    const validatedValue = schema.parse(fieldValue);
    return {
      errors: [],
      success: true,
      data: validatedValue as TypedFieldValue<T>,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path,
          code: err.code,
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [
        {
          path: [],
          code: 'UNKNOWN_ERROR',
          message: '알 수 없는 오류가 발생했습니다.',
        },
      ],
    };
  }
};

// 여러 필드 값을 한번에 검증하는 유틸리티 함수 추가
export const validateFieldValues = <T extends Field>(
  fieldValues: unknown[],
  fields: T[],
): ValidationResult<TypedFieldValue<T>[]> => {
  try {
    const results = fieldValues.map((value, index) => {
      const field = fields[index];
      if (!field) {
        throw new Error(`필드가 없습니다: ${index}`);
      }
      return validateFieldValue(value, field);
    });

    const hasError = results.some((result) => !result.success);
    if (hasError) {
      return {
        success: false,
        errors: results.flatMap((result) => result.errors),
      };
    }

    return {
      errors: [],
      success: true,
      data: results.map((result) => result.data!),
    };
  } catch {
    return {
      success: false,
      errors: [
        {
          path: [],
          code: 'VALIDATION_ERROR',
          message: '검증 중 오류가 발생했습니다.',
        },
      ],
    };
  }
};
