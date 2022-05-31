import { IItem } from "../../interfaces";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/items/';



export async function getItem(id: number): Promise<IItem> {
    const res = await fetch(baseUrl + id);
    return res.json().then(response => response.data);
}

export async function createItem({ item, collectionId }: { item: IItem, collectionId: number }): Promise<IItem> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, collectionId })
    };
    const res = await fetch(baseUrl, requestOptions);
    return res.json().then(response => response.data);
}


export async function deleteItem(id: string): Promise<boolean> {
    const res = await fetch(baseUrl + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}
