import { PropertyTypes } from '../types';

//SCHEMA
export interface IBase {
  //used as base for all schema
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGroup extends IBase {
  collections: string[];
  userId: string;
}

export interface ICollection extends IBase {
  userId?: string;
  description: string;
  isDescriptionHidden: boolean;
  properties: IProperty[];
  items: string[];
  isFavourite: boolean;
}
export interface IProperty extends IBase {
  name: string;
  type: PropertyTypes;
  values: string[];
}

export interface IItemProperty {
  _id?: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IItem extends IBase {
  properties: IItemProperty[];
}

export interface ITemplate extends IBase {
  properties: IProperty[];
  description: string;
  items: IItem[];
}
