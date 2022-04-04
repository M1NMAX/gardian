import { CollectionInterface, PropertyInCollectionInterface } from "../../interfaces";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getUserCollections(): Promise<CollectionInterface[]> {
    const res = await fetch(apiBaseUrl + '/collections');
    return res.json().then(response => response.data);
}

export async function createCollection(name: string, variant: string, isSub: boolean, parentName: string, collectionId: string | null): Promise<CollectionInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, variant, isSub, parentName, collectionId })
    };
    const res = await fetch(apiBaseUrl + '/collections', requestOptions);
    return res.json().then(response => response.data);
}

export async function getCollection(id: number): Promise<CollectionInterface> {
    const res = await fetch(apiBaseUrl + '/collections/' + id);
    return res.json().then(response => response.data);
}


export async function updateCustomCollection(id: string, name: string, properties: PropertyInCollectionInterface[]): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, properties })
    };
    const res = await fetch(apiBaseUrl + '/collections/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function updateCollection(id: string, name: string, description: string, isDescriptionHidden: boolean): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isDescriptionHidden })
    };
    const res = await fetch(apiBaseUrl + '/collections/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}


export async function renameCollection(id: string, name: string): Promise<boolean> {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    };
    const res = await fetch(apiBaseUrl + '/collections/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function deleteCollection(id: string): Promise<boolean> {
    const res = await fetch(apiBaseUrl + '/collections/' + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}
