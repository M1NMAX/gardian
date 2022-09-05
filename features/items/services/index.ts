import { getFetch } from '@lib/fetch';
import { Item, ItemProperty } from '@prisma/client';
import { IItem, IItemProperty } from '../../../interfaces';
import { getRequestOptions } from '../../../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/items/';

type CreateItemArg = {
  name: string;
  collectionId: string;
  properties: ItemProperty[];
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
  const res = await getFetch(baseUrl, 'POST', item);
  return res;
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
  const res = await getFetch(baseUrl + id, 'DELETE');
  return res;
}

// PROPERTY
export async function addPropertyToItem(
  id: string,
  property: { id: string; value: string }
) {
  const res = await getFetch(baseUrl + id + '/properties/', 'POST', {
    property,
  });
  return res;
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
