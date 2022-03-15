import { CollectionInterface } from "../interfaces";

export type Response = {
    isSuccess: boolean,
    data?: CollectionInterface[],
}