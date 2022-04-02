import { TodoInterface } from "../../interfaces";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createTodo(id: string, name: string, conclusionDate: string): Promise<TodoInterface> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId: id, name, conclusionDate })
    };

    const res = await fetch(apiBaseUrl + '/todos', requestOptions);
    return res.json().then(response => response.data);
}


export async function updateTodo(id: string, name: string, isConcluded: boolean,
    conclusionDate: string, reminderDate: string, description: string): Promise<boolean> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isConcluded, conclusionDate, reminderDate, description })
    };
    const res = await fetch(apiBaseUrl + '/todos/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);
}


export async function updateTodoIsConcluded(id: string, isConcluded: boolean): Promise<boolean> {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isConcluded })
    };
    const res = await fetch(apiBaseUrl + '/todos/' + id, requestOptions);
    return res.json().then(response => response.isSuccess);

}

export async function deleteTodo(id: string): Promise<boolean> {
    const res = await fetch(apiBaseUrl + '/todos/' + id, { method: 'DELETE' });
    return res.json().then(response => response.isSuccess);
}
