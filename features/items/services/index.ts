import { IItem, IItemProperty } from '../../../interfaces';
import { getRequestOptions } from '../../../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/items/';

export async function getItem(id: string): Promise<IItem> {
  const res = await fetch(baseUrl + id);
  return res.json().then((response) => response.data);
}

export async function getItems(ids: string[]): Promise<IItem[]> {
  const itemsPromise = ids.map(async (id: string) => await getItem(id));
  let items: IItem[] = [];
  for (const ip of itemsPromise) {
    const item = await ip;
    items.push(item);
  }

  return Promise.resolve(items);
}

export async function createItem(item: IItem): Promise<IItem> {
  const res = await fetch(baseUrl, getRequestOptions('POST', { item }));
  return res.json().then((response) => response.data);
}

export async function updateItem(id: string, item: IItem): Promise<boolean> {
  const res = await fetch(baseUrl + id, getRequestOptions('PUT', item));
  return res.json().then((response) => response.isSuccess);
}

export async function renameItem(id: string, name: string): Promise<boolean> {
  const item = await getItem(id);
  return updateItem(id, { ...item, name });
}

export async function deleteItem(id: string): Promise<boolean> {
  const res = await fetch(baseUrl + id, { method: 'DELETE' });
  return res.json().then((response) => response.isSuccess);
}

// PROPERTY
export async function addPropertyToItem(id: string, property: IItemProperty) {
  const res = await fetch(
    baseUrl + id + '/properties/',
    getRequestOptions('POST', { property })
  );
  return res.json().then((response) => response.data);
}

type UpdateItemPropertyArg = {
  itemId: string;
  propertyId: string;
  property: IItemProperty;
};
export async function updateItemProperty({
  itemId,
  propertyId,
  property,
}: UpdateItemPropertyArg) {
  const res = await fetch(
    baseUrl + itemId + '/properties/' + propertyId,
    getRequestOptions('PUT', { property })
  );
  return res.json().then((response) => response.data);
}

export async function removePropertyFromItem(
  itemId: string,
  propertyId: string
) {
  const res = await fetch(baseUrl + itemId + '/properties/' + propertyId, {
    method: 'DELETE',
  });
  return res.json().then((response) => response.data);
}
