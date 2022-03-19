import { Types } from 'mongoose'
export interface CollectionInterface {
    _id?: number,
    name: string;
    owner_id: string,
    variant: string,
    updatedAt?: Date;
    createdAt?: Date;
}

export interface TodoInterface {
    _id?: number,
    name: string;
    userId: string,
    collectionId: Types.ObjectId,
    isConcluded?: boolean,
    conclusionDate?: string,
    reminder?: boolean,
    updatedAt?: Date;
    createdAt?: Date;
}


export interface DocumentInterface {
    name: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface CollectionProps {
    collection: CollectionInterface,
}

export interface CollectionOverviewProps {
    collection: CollectionInterface,
}


export interface SidebarBtnProps {
    icon: JSX.Element,
    text: string,
}


export interface NewCollectionModalProps {
    open: boolean,
    handleClose: (value: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}

export interface NewEventModalProps {
    open: boolean,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}
export interface NewDocumentModalProps {
    open: boolean,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
}

export interface NewTodoModalProps {
    open: boolean,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}

export interface DocumentStatusProps {
    name: string,
    isSaved: boolean,
    error: string,
}