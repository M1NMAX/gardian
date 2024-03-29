import { getFetch } from '@lib/fetch';
import { Collection, Icon, Option, Prisma, PropertyType } from '@prisma/client';


const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/collections/';

const includeItemCount = Prisma.validator<Prisma.CollectionInclude>()({
  _count: { select: { items: true } },
});

export type CollectionWItemCount = Prisma.CollectionGetPayload<{
  include: typeof includeItemCount;
}>;

//Types
type RemovePropertyFromCollectionArg = {
  cid: string;
  pid: string;
};

type UpdateCollectionPropertyArg = {
  cid: string;
  property: Prisma.PropertyUpdateInput;
};

type AddPropertyToCollectionArg = {
  cid: string;
  property: Prisma.PropertyUpdateInput;
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
  collection: Prisma.CollectionUncheckedCreateWithoutUserInput
): Promise<Collection> {
  const res = await getFetch(baseUrl, 'POST', { collection });
  return res;
}

export async function updateCollection(
  cid: string,
  collection: Prisma.CollectionUncheckedUpdateInput
): Promise<Collection> {
  const res = await getFetch(baseUrl + cid, 'PUT', { collection });
  return res;
}

export async function changeCollectionIcon(
  cid: string,
  icon: Icon
): Promise<Collection> {
  return updateCollection(cid, { icon });
}

export async function renameCollection(
  cid: string,
  name: string
): Promise<Collection> {
  return updateCollection(cid, { name });
}

export async function toggleCollectionIsFavourite(
  cid: string
): Promise<Collection> {
  const collection = await getCollection(cid);
  return updateCollection(cid, { isFavourite: !collection.isFavourite });
}

export async function toggleCollectionDescriptionState(
  cid: string
): Promise<Collection> {
  const collection = await getCollection(cid);
  return updateCollection(cid, {
    isDescriptionHidden: !collection.isDescriptionHidden,
  });
}

export async function updateCollectionDescription(
  cid: string,
  description: string
): Promise<Collection> {
  return updateCollection(cid, { description });
}

export async function moveCollection(
  cid: string,
  gid: string
): Promise<Collection> {
  return updateCollection(cid, { groupId: gid });
}

export async function deleteCollection(cid: string): Promise<boolean> {
  const res = await getFetch(baseUrl + cid, 'DELETE');
  return res;
}

// PROPERTY
export async function addPropertyToCollection({
  cid,
  property,
}: AddPropertyToCollectionArg): Promise<Collection> {
  const res = await getFetch(baseUrl + cid + '/properties/', 'PUT', {
    property,
  });
  return res;
}

export async function updateCollectionProperty({
  cid,
  property,
}: UpdateCollectionPropertyArg): Promise<Collection | null> {
  let { id: pid, ...normalizad } = property;

  const res: Collection | null = await getFetch(
    baseUrl + cid + '/properties/' + pid,
    'PUT',
    {
      property: normalizad,
    }
  );

  return res;
}

export async function removePropertyFromCollection({
  cid,
  pid,
}: RemovePropertyFromCollectionArg): Promise<{
  collection: Collection;
  pid: string;
}> {
  const res: Collection = await getFetch(
    baseUrl + cid + '/properties/' + pid,
    'DELETE'
  );
  return { collection: res, pid };
}
