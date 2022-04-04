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

export async function updateEvent(id: string, name: string, date: string, time: string, description: string, reminder: boolean): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, time, description, reminder })
    };
    const res = await fetch(apiBaseUrl + '/events/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}


export async function renameEvent(id: string, name: string): Promise<boolean> {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    };
    const res = await fetch(apiBaseUrl + '/events/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function deleteEvent(id: string): Promise<boolean> {
    const res = await fetch(apiBaseUrl + '/events/' + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}


