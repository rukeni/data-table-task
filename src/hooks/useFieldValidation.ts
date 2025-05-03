import type { TypedFieldValue, Field } from '../shared/types/field';

import { useCallback, useState } from 'react';

import {
  type ValidationResult,
  validateFieldValues,
  validateFieldValue,
  validateField,
} from '../utils/validation';

interface UseFieldValidationResult<T extends Field> {
  isValid: boolean;
  validateSingleField: (field: unknown) => ValidationResult<Field>;
  validateSingleValue: (value: unknown, field: T) => ValidationResult<TypedFieldValue<T>>;
  validateMultipleValues: (
    values: unknown[],
    fields: T[],
  ) => ValidationResult<TypedFieldValue<T>[]>;
  clearError: () => void;
  lastError: string | null;
}

export const useFieldValidation = <T extends Field>(): UseFieldValidationResult<T> => {
  const [lastError, setLastError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  const clearError = useCallback(() => {
    setLastError(null);
    setIsValid(true);
  }, []);

  const handleValidationResult = useCallback(
    <R>(result: ValidationResult<R>) => {
      if (!result.success) {
        const errorMessage = result.errors[0]?.message || '알 수 없는 오류가 발생했습니다.';
        setLastError(errorMessage);
        setIsValid(false);
      } else {
        clearError();
      }
      return result;
    },
    [clearError],
  );

  const validateSingleField = useCallback(
    (field: unknown) => {
      const result = validateField(field);
      return handleValidationResult(result);
    },
    [handleValidationResult],
  );

  const validateSingleValue = useCallback(
    (value: unknown, field: T) => {
      const result = validateFieldValue(value, field);
      return handleValidationResult(result);
    },
    [handleValidationResult],
  );

  const validateMultipleValues = useCallback(
    (values: unknown[], fields: T[]) => {
      const result = validateFieldValues(values, fields);
      return handleValidationResult(result);
    },
    [handleValidationResult],
  );

  return {
    isValid,
    validateSingleField,
    validateSingleValue,
    validateMultipleValues,
    lastError,
    clearError,
  };
};
