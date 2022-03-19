import { TodoInterface } from "../../interfaces";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createTask(id: string, name: string, reminder: boolean, conclusionDate: string): Promise<TodoInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId: id, name, reminder, conclusionDate })
    };

    const res = await fetch(apiBaseUrl + '/todos', requestOptions);
    return res.json().then(response => response.data);
}
