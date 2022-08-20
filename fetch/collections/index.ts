import { ICollection, IProperty } from '../../interfaces';
import { getRequestOptions } from '../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/collections/';

//Types
type RemovePropertyFromCollectionArg = {
  collectionId: string;
  propertyId: string;
};

type UpdateCollectionPropertyArg = {
  collectionId: string;
  propertyId: string;
  property: IProperty;
};

type AddPropertyFromCollectionArg = {
  collectionId: string;
  property: IProperty;
};

//Collection
export async function getCollections(): Promise<ICollection[]> {
  const res = await fetch(baseUrl);
  return res.json().then((response) => response.data);
}

export async function getCollection(id: string): Promise<ICollection> {
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
  collectionId: string,
  collection: ICollection
): Promise<boolean> {
  const res = await fetch(
    baseUrl + collectionId,
    getRequestOptions('PUT', collection)
  );
  return res.json().then((response) => response.isSuccess);
}

export async function renameCollection(
  id: string,
  name: string
): Promise<boolean> {
  const collection = await getCollection(id);
  return updateCollection(id, { ...collection, name });
}

export async function toggleCollectionIsFavourite(
  id: string
): Promise<boolean> {
  const collection = await getCollection(id);
  return updateCollection(id, {
    ...collection,
    isFavourite: !collection.isFavourite,
  });
}

export async function toggleCollectionDescriptionState(
  id: string
): Promise<boolean> {
  const collection = await getCollection(id);
  return updateCollection(id, {
    ...collection,
    isDescriptionHidden: !collection.isDescriptionHidden,
  });
}

export async function updateCollectionDescription(
  id: string,
  description: string
): Promise<boolean> {
  const collection = await getCollection(id);
  return updateCollection(id, { ...collection, description });
}

export async function deleteCollection(id: string): Promise<boolean> {
  const res = await fetch(baseUrl + id, { method: 'DELETE' });
  return res.json().then((response) => response.isSuccess);
}

//ITEM
export async function addItemToCollection(
  collectionId: string,
  itemId: string
) {
  const res = await fetch(baseUrl + collectionId + '/items/' + itemId, {
    method: 'PATCH',
  });
  return res.json().then((response) => response.isSuccess);
}

export async function removeItemFromCollection(
  collectionId: string,
  itemId: string
): Promise<boolean> {
  const res = await fetch(baseUrl + collectionId + '/items/' + itemId, {
    method: 'DELETE',
  });
  return res.json().then((response) => response.isSuccess);
}

// PROPERTY
export async function addPropertyToCollection({
  collectionId,
  property,
}: AddPropertyFromCollectionArg): Promise<ICollection> {
  const res = await fetch(
    baseUrl + collectionId + '/properties/',
    getRequestOptions('POST', { property })
  );
  return res.json().then((response) => response.data);
}

export async function updateCollectionProperty({
  collectionId,
  propertyId,
  property,
}: UpdateCollectionPropertyArg): Promise<{
  status: boolean;
  propertyId: string;
}> {
  const res = await fetch(
    baseUrl + collectionId + '/properties/' + propertyId,
    getRequestOptions('PUT', { property })
  );
  return res.json().then((response) => ({
    status: response.isSuccess,
    propertyId,
  }));
}

export async function removePropertyFromCollection({
  collectionId,
  propertyId,
}: RemovePropertyFromCollectionArg): Promise<{
  status: boolean;
  propertyId: string;
}> {
  const res = await fetch(
    baseUrl + collectionId + '/properties/' + propertyId,
    { method: 'DELETE' }
  );
  return res.json().then((response) => ({
    status: response.isSuccess,
    propertyId,
  }));
}
