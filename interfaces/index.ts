export interface CollectionInterface {
    _id?: number,
    name: string;
    owner_id: string,
    variant: string, 
    updatedAt?: Date;
    createdAt?: Date;
}


export interface DocumentInterface {
    name: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface SidebarBtnProps {
    icon: JSX.Element,
    text: string,
}


export interface ModalCreateCollectionProps {
    open: boolean,
    handleClose: (value: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}