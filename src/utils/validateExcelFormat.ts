export interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string;
  priority: '高' | '中' | '低';
  createdAt: string;
}

export const validateExcelFormat = (jsonData: unknown[]): jsonData is TodoItem[] => {
  if (!Array.isArray(jsonData)) return false;
  for (const item of jsonData) {
    if (typeof item !== 'object' || item === null) return false;
    const { value, detail, reminderTime, priority, createdAt } = item as TodoItem;
    if (typeof value !== 'string' || typeof detail !== 'string') return false;
    if (reminderTime && typeof reminderTime !== 'string') return false;
    if (priority !== '高' && priority !== '中' && priority !== '低') return false;
    if (typeof createdAt !== 'string') return false;
  }
  return true;
};

