import { CollectionInterface } from "../interfaces";

export type Response = {
    isSuccess: boolean,
    data?: CollectionInterface[],
}

export type CollectionUpdateData = {
    name?: string,
    variant?: string,
    description?: string
}