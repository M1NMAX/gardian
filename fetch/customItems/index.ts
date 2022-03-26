import { CustomItemInterface } from "../../interfaces";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createCustomItem(collectionId: string, name: string, status: string, extraProperties?: { name: string, value: string }[])
    : Promise<CustomItemInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, name, status, extraProperties })
    };
    console.log(typeof extraProperties)
    const res = await fetch(apiBaseUrl + '/customItems', requestOptions);
    return res.json().then(response => response.data);
}
