export interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string;
  priority: string;
  createdAt: string;
}

export const validateExcelFormat = (jsonData: any[]): jsonData is TodoItem[] => {
  console.log('Validating JSON data:', jsonData);

  if (!Array.isArray(jsonData)) {
    console.error('Data is not an array');
    return false;
  }

  const isValid = jsonData.every((item) => {
    const hasValidFields =
      typeof item.value === 'string' &&
      typeof item.detail === 'string' &&
      (typeof item.reminderTime === 'string' || item.reminderTime === undefined) &&
      typeof item.priority === 'string' &&
      typeof item.createdAt === 'string';
      
    console.log('Validating item:', item, 'Is valid:', hasValidFields);
    return hasValidFields;
  });

  console.log('Validation result:', isValid);
  return isValid;
};


