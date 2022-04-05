import { Types } from 'mongoose';
import { FC } from 'react';

//Schemas
interface basicSchema {
    _id?: number,
    name: string,
    userId: string,
    collectionId: Types.ObjectId | null,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface PropertyInCollectionInterface {
    _id?: number,
    name: string,
    type: string,
    values: string[]
}

export interface PropertyInItemInterface {
    _id?: number,
    name: string,
    value: string,
}

export interface CollectionInterface extends basicSchema {
    variant: string,
    isSub: boolean,
    properties: PropertyInCollectionInterface[],
    description: string,
    isDescriptionHidden: boolean,
    parentName: string,
}

export interface CustomItemInterface extends basicSchema {
    properties?: PropertyInItemInterface[],
}

export interface EventInterface extends basicSchema {
    date: string,
    time: string,
    reminder: boolean,
    description: string,
}


export interface DocumentInterface extends basicSchema {
    content: string
}

export interface TodoInterface extends basicSchema {
    isConcluded: boolean,
    conclusionDate?: string,
    reminderDate?: string,
    description?: string,
}

//Components props

export interface CollectionOverviewProps {
    collection: CollectionInterface,
}


export interface SidebarBtnProps {
    icon: JSX.Element,
    text: string,
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void,
}


export interface ModalProps {
    open: boolean,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}
export interface NewCollectionModalProps extends ModalProps {
    isSub: boolean,
    collectionId: string | null,
    parentName: string,
}

export interface DocumentStatusProps {
    isSaved: boolean,
    isError: boolean,
}