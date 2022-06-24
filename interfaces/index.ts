import { PropertyTypes } from '../types';

//Base schema
interface IBase {
  _id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGroup extends IBase {
  collections: number[] | ICollection[];
  userId: string;
}

export interface IProperty extends IBase {
  name: string;
  type: PropertyTypes;
  values: string[];
  color: string;
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
  properties?: IProperty[];
  items?: number[] | IItem[];
  isFavourite: boolean;
}

export interface ITemplate extends IBase {
  properties: IProperty[];
  description?: string;
  items?: number[] | IItem[];
}

//Components props
export interface ModalProps {
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  positiveFeedback: (value: string) => void;
  negativeFeedback: () => void;
}
