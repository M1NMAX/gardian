import { IGroup } from "../../interfaces";


const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createGroup(name: string,): Promise<IGroup> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    };
    const res = await fetch(apiBaseUrl + '/groups', requestOptions);
    return res.json().then(response => response.data);
}


export async function getGroups(): Promise<IGroup[]> {
    const res = await fetch(apiBaseUrl + '/groups');
    return res.json().then(response => response.data);
} 
export async function getGroup(id: number): Promise<IGroup> {
    const res = await fetch(apiBaseUrl + '/groups/' + id);
    return res.json().then(response => response.data);
}