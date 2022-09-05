import { getFetch } from '@lib/fetch';
import { Group, Prisma } from '@prisma/client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/groups/';

const selectCollectionsId = Prisma.validator<Prisma.GroupSelect>()({
  collections: { select: { id: true } },
});

export type GroupWithCollectionsId = Prisma.GroupGetPayload<{
  include: typeof selectCollectionsId;
}>;
export async function getGroups(): Promise<GroupWithCollectionsId[]> {
  const res = await getFetch(baseUrl);
  return res;
}
export async function getGroup(id: string): Promise<GroupWithCollectionsId> {
  const res = await getFetch(baseUrl + id);
  return res;
}

export async function createGroup(
  name: string
): Promise<GroupWithCollectionsId> {
  const res = await getFetch(baseUrl, 'POST', { name });
  return res;
}

export async function updateGroup(
  id: string,
  group: Prisma.GroupUpdateInput
): Promise<Group> {
  const res = await getFetch(baseUrl + id, 'PUT', { group });
  return res;
}

export async function deleteGroup(id: string): Promise<boolean> {
  const res = await getFetch(baseUrl + id, 'DELETE');
  return res;
}

export async function renameGroup(id: string, name: string): Promise<Group> {
  return updateGroup(id, { name });
}

//REMOVE
export async function addCollectionToGroup(
  groupId: string,
  collectionId: string
): Promise<boolean> {
  const res = await fetch(baseUrl + groupId + '/collections/' + collectionId, {
    method: 'PATCH',
  });
  return res.json().then((response) => response.isSuccess);
}

export async function removeCollectionFromGroup(
  groupId: string,
  collectionId: string
): Promise<boolean> {
  const res = await fetch(baseUrl + groupId + '/collections/' + collectionId, {
    method: 'DELETE',
  });
  return res.json().then((response) => response.isSuccess);
}
