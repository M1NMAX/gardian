//Base schema
interface IBase {
    _id?: number,
    name: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface IGroup extends IBase {
    collections: Number[] | ICollection[]
    userId: string,
}

export interface IProperty extends IBase {
    type: string,
    values: string[],
}
export interface ITemplate extends IBase {
    properties: IProperty[],
}

export interface IItem extends IBase {
    value: string,
}

export interface ICollection extends IBase {
    userId?: string | null,
    description: string,
    template?: ITemplate,
    items?: IItem[],
}

//Components props
export interface ModalProps {
    open: boolean,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    positiveFeedback: (value: string) => void,
    negativeFeedback: () => void,
}


export interface DocumentStatusProps {
    isSaved: boolean,
    isError: boolean,
}