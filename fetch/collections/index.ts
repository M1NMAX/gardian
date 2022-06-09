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

export async function createCollection({
  collection,
  groupId,
}: {
  collection: ICollection;
  groupId: number;
}): Promise<ICollection> {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collection, groupId }),
  };
  const res = await fetch(baseUrl, requestOptions);
  return res.json().then((response) => response.data);
}

export async function updateCollection(
  collectionId: number,
  collection: ICollection
): Promise<boolean> {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection),
  };
  const res = await fetch(baseUrl + collectionId, requestOptions);
  return res.json().then((response) => response.isSuccess);
}

export async function renameCollection(
  id: string,
  name: string
): Promise<boolean> {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  };
  const res = await fetch(baseUrl + id, requestOptions);
  return res.json().then((response) => response.isSuccess);
}

export async function deleteCollection(id: string): Promise<boolean> {
  const res = await fetch(baseUrl + id, { method: 'DELETE' });
  return res.json().then((response) => response.isSuccess);
}

export async function removeItemFromCollection(
  collectionId: number,
  itemId: number
): Promise<boolean> {
  const res = await fetch(baseUrl + collectionId + '/' + itemId, {
    method: 'PATCH',
  });
  return res.json().then((response) => response.isSuccess);
}

// Property
export async function addProperty(property: IProperty, collectionId: number) {
  const res = await fetch(
    baseUrl + collectionId + '/template/new',
    getRequestOptions('PATCH', { property, op: 'a' })
  );
  return res.json().then((response) => response.data);
}

export async function updProperty(property: IProperty, collectionId: number) {
  const res = await fetch(
    baseUrl + collectionId,
    getRequestOptions('PATCH', { property, op: 'm' })
  );
  return res.json().then((response) => response.data);
}

export async function deleteProperty(propertyId: number, collectionId: number) {
  const res = await fetch(
    baseUrl + collectionId,
    getRequestOptions('PATCH', { propertyId, op: 'a' })
  );
  return res.json().then((response) => response.data);
}
