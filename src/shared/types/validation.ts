import { z } from 'zod';

export interface ValidationError {
  message: string;
  path: (string | number)[];
  code?: 'VALIDATION_ERROR' | 'UNKNOWN_ERROR' | z.ZodIssueCode;
}

export interface ValidationResult<T = unknown> {
  data?: T;
  success: boolean;
  errors: ValidationError[];
}
