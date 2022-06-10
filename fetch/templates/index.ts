import { ITemplate } from "../../interfaces";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/templates/';

export async function getTemplates(): Promise<ITemplate[]> {
    const res = await fetch(baseUrl);
    return res.json().then(response => response.data);
}

export async function getTemplate(id: number): Promise<ITemplate> {
    const res = await fetch(baseUrl + id);
    return res.json().then(response => response.data);
}

export async function createTemplate(template: ITemplate): Promise<ITemplate> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
    };
    const res = await fetch(baseUrl, requestOptions);
    return res.json().then(response => response.data);
}

export async function updateTemplate(id: string, name: string, description: string, isDescriptionHidden: boolean): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isDescriptionHidden })
    };
    const res = await fetch(baseUrl + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}

export async function deleteTemplate(id: string): Promise<boolean> {
    const res = await fetch(baseUrl + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}
