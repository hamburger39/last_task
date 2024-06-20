// src/app/utils/validateExcelFormat.ts
export interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string;
  priority: string;
  createdAt: string;
}

export const validateExcelFormat = (jsonData: TodoItem[]): void => {
  jsonData.forEach((item, index) => {
    if (typeof item.value !== 'string') {
      throw new Error(`Invalid data type for 'value' in row ${index + 1}`);
    }
    if (typeof item.detail !== 'string') {
      throw new Error(`Invalid data type for 'detail' in row ${index + 1}`);
    }
    if (item.reminderTime && isNaN(Date.parse(item.reminderTime))) {
      throw new Error(`Invalid data type for 'reminderTime' in row ${index + 1}`);
    }
    if (!['高', '中', '低'].includes(item.priority)) {
      throw new Error(`Invalid value for 'priority' in row ${index + 1}`);
    }
    if (isNaN(Date.parse(item.createdAt))) {
      throw new Error(`Invalid data type for 'createdAt' in row ${index + 1}`);
    }
  });
};
