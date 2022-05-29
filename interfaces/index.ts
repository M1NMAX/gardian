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
    name: string,
    type: "text" | "select" | "date" | "time" | "url",
    values: string[],
    color: string,
}
export interface ITemplate extends IBase {
    properties: IProperty[],
    description: string,
}


export interface IItemProperty extends IBase {
    value: string,
}
export interface IItem extends IBase {
    properties: IItemProperty[],
}

export interface ICollection extends IBase {
    userId?: string | null,
    description: string,
    template?: ITemplate,
    items?: IItem[],
}


//Item example for template 
export interface IExample extends IBase {
    items: IItem[],
    templateId: number
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