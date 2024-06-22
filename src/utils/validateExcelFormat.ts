export interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string;
  priority: string;
  createdAt: string;
}

export const validateExcelFormat = (jsonData: unknown[]): jsonData is TodoItem[] => {
  console.log('Validating JSON data:', jsonData);

  if (!Array.isArray(jsonData)) {
    console.error('Data is not an array');
    return false;
  }

  const isValid = jsonData.every((item) => {
    if (typeof item !== 'object' || item === null) return false;

    const hasValidFields =
      typeof (item as TodoItem).value === 'string' &&
      typeof (item as TodoItem).detail === 'string' &&
      (typeof (item as TodoItem).reminderTime === 'string' || (item as TodoItem).reminderTime === undefined) &&
      typeof (item as TodoItem).priority === 'string' &&
      typeof (item as TodoItem).createdAt === 'string';
      
    console.log('Validating item:', item, 'Is valid:', hasValidFields);
    return hasValidFields;
  });

  console.log('Validation result:', isValid);
  return isValid;
};

