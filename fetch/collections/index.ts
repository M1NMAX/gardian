import { Response } from "../../types";

export async function getUserCollections(): Promise<Response> {
    const res = await fetch('api/collections');
    return res.json();
}

export async function createCollection(): Promise<Response> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'React POST Request Example' })
    };
    const res = await fetch('api/collections', requestOptions);
    return res.json();
}