import { IItem } from '../../interfaces';
import { getRequestOptions } from '../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/items/';

export async function getItem(id: number): Promise<IItem> {
  const res = await fetch(baseUrl + id);
  return res.json().then((response) => response.data);
}

export async function createItem(item: IItem): Promise<IItem> {
  const res = await fetch(baseUrl, getRequestOptions('POST', { item }));
  return res.json().then((response) => response.data);
}

export async function updateItem(
  itemId: number,
  item: IItem
): Promise<boolean> {
  const res = await fetch(baseUrl + itemId, getRequestOptions('PUT', item));
  return res.json().then((response) => response.isSuccess);
}

export async function renameItem(id: number, name: string): Promise<boolean> {
  const item = await getItem(id);
  return updateItem(id, { ...item, name });
}

export async function deleteItem(id: number): Promise<boolean> {
  const res = await fetch(baseUrl + id, { method: 'DELETE' });
  return res.json().then((response) => response.isSuccess);
}
