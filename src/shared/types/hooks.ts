import { ValidationResult } from './validation';
import { TypedFieldValue, Field } from './field';

export interface UseFieldValidationResult<T extends Field> {
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
