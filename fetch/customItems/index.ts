import { CustomItemInterface, PropertyInItemInterface } from "../../interfaces";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createCustomItem(collectionId: string, name: string, properties?: PropertyInItemInterface[])
    : Promise<CustomItemInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, name, properties })
    };
    const res = await fetch(apiBaseUrl + '/customItems', requestOptions);
    return res.json().then(response => response.data);
}

export async function updateCustomItem(id: string, name: string, properties: PropertyInItemInterface[]): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, properties })
    };
    const res = await fetch(apiBaseUrl + '/customItems/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}