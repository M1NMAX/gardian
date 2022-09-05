import { getFetch } from '@lib/fetch';
import { Collection, Prisma, Property, PropertyType } from '@prisma/client';

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
  cid: string;
  pid: string;
};

type UpdateCollectionPropertyArg = {
  cid: string;
  property: { id: string; name: string; type: PropertyType; values: string[] };
};

type AddPropertyFromCollectionArg = {
  cid: string;
  property: { name: string; type: PropertyType; values: string[] };
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
  const res = await getFetch(baseUrl, 'POST', { collection });
  return res;
}

export async function updateCollection(
  collection: Collection
): Promise<Collection> {
  console.log(collection);
  let { id: cid, createdAt, updatedAt, ...normalized } = collection;
  const res = await getFetch(baseUrl + cid, 'PUT', { collection: normalized });
  return res;
}

export async function changeCollectionIcon(
  id: string,
  icon: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection({ ...collection, icon });
}

export async function renameCollection(
  id: string,
  name: string
): Promise<Collection> {
  const collection = await getCollection(id);
  //remove item count
  let { _count, ...withoutCount } = collection;

  return updateCollection({ ...withoutCount, name });
}

export async function toggleCollectionIsFavourite(
  id: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection({
    ...collection,
    isFavourite: !collection.isFavourite,
  });
}

export async function toggleCollectionDescriptionState(
  id: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection({
    ...collection,
    isDescriptionHidden: !collection.isDescriptionHidden,
  });
}

export async function updateCollectionDescription(
  id: string,
  description: string
): Promise<Collection> {
  const collection = await getCollection(id);
  return updateCollection({ ...collection, description });
}

export async function deleteCollection(id: string): Promise<boolean> {
  const res = await getFetch(baseUrl + id, 'DELETE');
  return res;
}

// PROPERTY
export async function addPropertyToCollection({
  cid,
  property,
}: AddPropertyFromCollectionArg): Promise<Collection> {
  const res = await getFetch(baseUrl + cid + '/properties/', 'PUT', {
    property,
  });
  return res;
}

export async function updateCollectionProperty({
  cid,
  property,
}: UpdateCollectionPropertyArg): Promise<{
  status: boolean;
  propertyId: string;
}> {
  let { id: pid, ...normalizad } = property;

  const res = await getFetch(baseUrl + cid + '/properties/' + pid, 'PUT', {
    property: normalizad,
  });

  return res;
}

export async function removePropertyFromCollection({
  cid,
  pid,
}: RemovePropertyFromCollectionArg): Promise<{
  status: boolean;
  pid: string;
}> {
  const res = await getFetch(baseUrl + cid + '/properties/' + pid, 'DELETE');
  return { status: true, pid };
}
