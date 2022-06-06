import { ICollection, IGroup } from '../interfaces';

export type Response = {
  isSuccess: boolean;
  data?: ICollection[] | IGroup[];
};

export type PropertyType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'url'
  | 'date'
  | 'number'
  | 'multi-select'
  | 'file';
