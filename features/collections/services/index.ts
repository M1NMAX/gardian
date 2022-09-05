import { getFetch } from '@lib/fetch';
import { Collection, Prisma, Property } from '@prisma/client';
import { ICollection, IProperty } from '../../../interfaces';
import { getRequestOptions } from '../../../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/collections/';

const includeItemCount = Prisma.validator<Prisma.CollectionInclude>()({
  _count: { select: { items: true } },
});

export type CollectionWItemCount = Prisma.CollectionGetPayload<{
  include: typeof includeItemCount;
}>;

//Types~

type CreateCollectionArg = {
  name: string;
  groupId: string;
  //properties: Property[]
};
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
export async function getCollections(): Promise<CollectionWItemCount[]> {
  const res = await getFetch(baseUrl);
  return res;
}

export async function getCollection(id: string): Promise<CollectionWItemCount> {
  const res = await getFetch(baseUrl + id);
  return res;
}

export async function createCollection(
  collection: CreateCollectionArg
): Promise<Collection> {
  const res = await getFetch(baseUrl, 'POST', collection);
  return res;
}

export async function updateCollection(
  collectionId: string,
  collection: Collection
): Promise<Collection> {
  console.log(collection);
  let { id, ...withoutId } = collection;
  const res = await getFetch(baseUrl + collectionId, 'PUT', withoutId);
  return res;
}

export async function changeCollectionIcon(
  id: string,
  icon: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection(id, { ...collection, icon });
}

export async function renameCollection(
  id: string,
  name: string
): Promise<Collection> {
  const collection = await getCollection(id);
  let { _count, ...withoutCount } = collection;

  return updateCollection(id, { ...withoutCount, name });
}

export async function toggleCollectionIsFavourite(
  id: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection(id, {
    ...collection,
    isFavourite: !collection.isFavourite,
  });
}

export async function toggleCollectionDescriptionState(
  id: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection(id, {
    ...collection,
    isDescriptionHidden: !collection.isDescriptionHidden,
  });
}

export async function updateCollectionDescription(
  id: string,
  description: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection(id, { ...collection, description });
}

export async function deleteCollection(id: string): Promise<boolean> {
  const res = await getFetch(baseUrl + id, 'DELETE');
  return res;
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
