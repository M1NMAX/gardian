import { Types } from 'mongoose';

//Schemas
interface basicSchema {
    _id?: number,
    name: string,
    userId: string,
    collectionId: Types.ObjectId | null,
    createdAt?: Date,
    updatedAt?: Date,
}
export interface CollectionInterface extends basicSchema {
    variant: string,
    isSub: boolean,
}

export interface CustomItemInterface extends basicSchema {
    status: string,
    extraProperties?: { _id?: number, name: string, value: string }[],
}

export interface EventInterface extends basicSchema {
    date: string,
    time?: string,
    reminder?: boolean,
    description?: string,
}


export interface DocumentInterface extends basicSchema {
    content: string
}

export interface SubCollectionInterface extends basicSchema {
    variant: string,
    collectionId: Types.ObjectId,
}

export interface TodoInterface extends basicSchema {
    isConcluded?: boolean,
    conclusionDate?: string,
    reminder?: boolean,
}

//Components props
export interface CollectionProps {
    collection: CollectionInterface,
}

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
}

export interface DocumentStatusProps {
    name: string,
    isSaved: boolean,
    error: string,
}