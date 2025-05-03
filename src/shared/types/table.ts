import type { ColumnsType } from 'antd/es/table';

export interface TableProps<T> {
  records: T[];
  rowKey?: string;
  pageSize?: number;
  columns: ColumnsType<T>;
  editingRecord?: null | T;
  isModalVisible?: boolean;
  onEdit?: (record: null | T) => void;
  recordFormComponent?: React.FC<{
    onClose: () => void;
    record: T;
  }>;
}
