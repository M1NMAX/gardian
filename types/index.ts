import { CollectionInterface, TodoInterface } from "../interfaces";

export type Response = {
    isSuccess: boolean,
    data?: CollectionInterface[] | TodoInterface[],
}

export type CollectionUpdateData = {
    name?: string,
    variant?: string,
    description?: string
}