import { ICollection, IGroup } from '../interfaces';

export type Response = {
  isSuccess: boolean;
  data?: ICollection[] | IGroup[];
};

export type PropertyTypes =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'url'
  | 'date'
  | 'number';
