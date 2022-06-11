import { ICollection, IProperty } from '../../interfaces';
import { getRequestOptions } from '../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/collections/';

//Collection
export async function getCollections(): Promise<ICollection[]> {
  const res = await fetch(baseUrl);
  return res.json().then((response) => response.data);
}

export async function getCollection(id: number): Promise<ICollection> {
  const res = await fetch(baseUrl + id);
  return res.json().then((response) => response.data);
}

export async function createCollection(
  collection: ICollection
): Promise<ICollection> {
  const res = await fetch(baseUrl, getRequestOptions('POST', { collection }));
  return res.json().then((response) => response.data);
}

export async function updateCollection(
  collectionId: number,
  collection: ICollection
): Promise<boolean> {
  const res = await fetch(
    baseUrl + collectionId,
    getRequestOptions('PUT', collection)
  );
  return res.json().then((response) => response.isSuccess);
}

export async function renameCollection(
  id: number,
  name: string
): Promise<boolean> {
  const collection = await getCollection(id);
  return updateCollection(id, { ...collection, name });
}

export async function deleteCollection(id: string): Promise<boolean> {
  const res = await fetch(baseUrl + id, { method: 'DELETE' });
  return res.json().then((response) => response.isSuccess);
}

//ITEM
export async function addItemToCollection(
  collectionId: number,
  itemId: number
) {
  const res = await fetch(baseUrl + collectionId + '/' + itemId, {
    method: 'PATCH',
  });
  return res.json().then((response) => response.isSuccess);
}

export async function removeItemFromCollection(
  collectionId: number,
  itemId: number
): Promise<boolean> {
  const res = await fetch(baseUrl + collectionId + '/' + itemId, {
    method: 'DELETE',
  });
  return res.json().then((response) => response.isSuccess);
}

// PROPERTY
export async function addProperty(property: IProperty, collectionId: number) {
  const res = await fetch(
    baseUrl + collectionId + '/template/new',
    getRequestOptions('PATCH', { property })
  );
  return res.json().then((response) => response.data);
}

export async function updProperty(property: IProperty, collectionId: number) {
  const res = await fetch(
    baseUrl + collectionId + '/template/update',
    getRequestOptions('PATCH', { property })
  );
  return res.json().then((response) => response.data);
}

export async function deleteProperty(propertyId: number, collectionId: number) {
  const res = await fetch(
    baseUrl + collectionId + '/template/remove',
    getRequestOptions('PATCH', { propertyId })
  );
  return res.json().then((response) => response.data);
}
