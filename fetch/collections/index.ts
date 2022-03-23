import { CollectionInterface } from "../../interfaces";
import { CollectionUpdateData } from "../../types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getUserCollections(): Promise<CollectionInterface[]> {
    const res = await fetch(apiBaseUrl + '/collections');
    return res.json().then(response => response.data);
}

export async function createCollection(name: string, variant: string, isSub: boolean): Promise<CollectionInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, variant, isSub })
    };
    const res = await fetch(apiBaseUrl + '/collections', requestOptions);
    return res.json().then(response => response.data);
}

export async function getCollection(id: number): Promise<CollectionInterface> {
    const res = await fetch(apiBaseUrl + '/collections/' + id);
    return res.json().then(response => response.data);
}


export async function updateCollection(id: number, data: CollectionUpdateData): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const res = await fetch(apiBaseUrl + '/collections/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function deleteCollection(id: number): Promise<boolean> {
    const res = await fetch(`api/collections/${id}`, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}
