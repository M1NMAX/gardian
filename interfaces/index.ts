import { PropertyTypes } from '../types';

//SCHEMA
interface IBase {
  //used a base for all schema
  _id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGroup extends IBase {
  collections: string[];
  userId: string;
}

export interface IProperty extends IBase {
  name: string;
  type: PropertyTypes;
  values: string[];
}

export interface IItemProperty {
  _id?: number;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IItem extends IBase {
  properties: IItemProperty[];
}

export interface ICollection extends IBase {
  userId?: string | null;
  description: string;
  isDescriptionHidden: boolean;
  properties: IProperty[];
  items: number[];
  isFavourite: boolean;
}

export interface ITemplate extends IBase {
  properties: IProperty[];
  description: string;
  items: IItem[];
}

//UI
export interface SortOption {
  name: string;
  alias: string;
}
