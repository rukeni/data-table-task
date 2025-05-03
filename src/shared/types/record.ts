export interface Record {
  id: string;
  [key: string]: FieldValue;
}

export type FieldValue = boolean | string | Date;
