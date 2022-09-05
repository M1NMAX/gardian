import { getFetch } from '@lib/fetch';
import { Item, ItemProperty, Prisma } from '@prisma/client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/items/';

//TYPES
type CreateItemArg = {
  name: string;
  collectionId: string;
  properties: ItemProperty[];
};

type UpdateItemPropertyArg = {
  id: string;
  property: ItemProperty;
};

export async function getItem(id: string): Promise<Item> {
  const res = await getFetch(baseUrl + id);
  return res;
}

export async function getItems(cid: string): Promise<Item[]> {
  const res = await getFetch(baseUrl + 'collection/' + cid);
  return res;
}

export async function createItem(item: CreateItemArg): Promise<Item> {
  const res = await getFetch(baseUrl, 'POST', { item });
  return res;
}

export async function updateItem(
  id: string,
  item: Prisma.ItemUpdateInput
): Promise<Item> {
  const res = await getFetch(baseUrl + id, 'PUT', { item });
  return res;
}

export async function renameItem(id: string, name: string): Promise<Item> {
  return updateItem(id, { name });
}

export async function deleteItem(id: string): Promise<boolean> {
  const res = await getFetch(baseUrl + id, 'DELETE');
  return res;
}

// PROPERTY
export async function addPropertyToItem(id: string, property: ItemProperty) {
  const res = await getFetch(baseUrl + id + '/properties/', 'PUT', {
    property,
  });
  return res;
}

export async function updateItemProperty({
  id,
  property,
}: UpdateItemPropertyArg) {
  const { id: pid } = property;
  const res = await getFetch(baseUrl + id + '/properties/' + pid, 'PUT', {
    property,
  });
  return res;
}

export async function removePropertyFromItem(id: string, pid: string) {
  const res = await getFetch(baseUrl + id + '/properties/' + pid, 'DELETE');
  return res;
}
