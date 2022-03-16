import { CollectionInterface } from "../../interfaces";

export async function getUserCollections(): Promise<CollectionInterface[]> {
    const res = await fetch('api/collections');
    return res.json().then(response => response.data);
}

export async function createCollection(): Promise<CollectionInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'React POST Request Example' })
    };
    const res = await fetch('api/collections', requestOptions);
    return res.json().then(response => response.data);
}