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
