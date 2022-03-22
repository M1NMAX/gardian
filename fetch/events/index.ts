import { EventInterface } from "../../interfaces";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createEvent(collectionId: string, name: string, date: string, time: string, description: string, reminder: boolean)
    : Promise<EventInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, name, date, time, description, reminder, })
    };

    const res = await fetch(apiBaseUrl + '/events', requestOptions);
    return res.json().then(response => response.data);
}
