export type PropertyTypes =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'url'
  | 'date'
  | 'number';

//Sort
export type FieldType = 'name' | 'createdAt' | 'updatedAt';
export type OrderType = 'asc' | 'desc';
export type SortOptionType = { field: FieldType; order: OrderType };
