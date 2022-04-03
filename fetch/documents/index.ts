import { DocumentInterface } from "../../interfaces";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createDocument(collectionId: string, name: string, content: string)
    : Promise<DocumentInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, name, content })
    };

    const res = await fetch(apiBaseUrl + '/documents', requestOptions);
    return res.json().then(response => response.data);
}

export async function updateDocument(id: string, name: string, content: string): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content })
    };
    const res = await fetch(apiBaseUrl + '/documents/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}


export async function renameDocument(id: string, name: string): Promise<boolean> {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    };
    const res = await fetch(apiBaseUrl + '/documents/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(apiBaseUrl + '/documents/' + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}

