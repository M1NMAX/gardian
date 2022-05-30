import { ICollection } from "../../interfaces";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/collections/';

export async function getCollections(): Promise<ICollection[]> {
    const res = await fetch(baseUrl);
    return res.json().then(response => response.data);
}

export async function getCollection(id: number): Promise<ICollection> {
    const res = await fetch(baseUrl + id);
    return res.json().then(response => response.data);
}

export async function createCollection({ collection, groupId }: { collection: ICollection, groupId: number }): Promise<ICollection> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, groupId })
    };
    const res = await fetch(baseUrl, requestOptions);
    return res.json().then(response => response.data);
}

export async function updateCollection(id: string, name: string, description: string, isDescriptionHidden: boolean): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isDescriptionHidden })
    };
    const res = await fetch(baseUrl + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}


export async function renameCollection(id: string, name: string): Promise<boolean> {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    };
    const res = await fetch(baseUrl + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function deleteCollection(id: string): Promise<boolean> {
    const res = await fetch(baseUrl + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}
