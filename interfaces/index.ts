export interface CollectionInterface {
    _id?: number,
    name: string;
    owner_id: string,
    updatedAt?: Date;
    createdAt?: Date;
}


export interface DocumentInterface {
    name: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface ModalCreateCollectionProps {
    open: boolean,
    handleClose: (value: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}