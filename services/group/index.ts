import { IGroup } from '../../interfaces';
import { getRequestOptions } from '../utils';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/groups/';

//Types

export async function createGroup(name: string): Promise<IGroup> {
  const res = await fetch(baseUrl, getRequestOptions('POST', { name }));
  return res.json().then((response) => response.data);
}

export async function getGroups(): Promise<IGroup[]> {
  const res = await fetch(baseUrl);
  return res.json().then((response) => response.data);
}
export async function getGroup(id: string): Promise<IGroup> {
  const res = await fetch(baseUrl + id);
  return res.json().then((response) => response.data);
}

export async function updateGroup(id: string, group: IGroup): Promise<boolean> {
  const res = await fetch(baseUrl + id, getRequestOptions('PUT', group));
  return res.json().then((response) => response.isSuccess);
}

export async function deleteGroup(id: string): Promise<boolean> {
  const res = await fetch(baseUrl + id, { method: 'DELETE' });
  return res.json().then((response) => response.isSuccess);
}

export async function renameGroup(id: string, name: string): Promise<boolean> {
  const group = await getGroup(id);
  return updateGroup(id, { ...group, name });
}

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

export async function getGroupWithCid(cid: string) {
  try {
    const groups = await getGroups();

    const group = groups.find((group) => group.collections.includes(cid));
    return group ? group : ({} as IGroup);
  } catch (error) {
    console.log(error);
    return {} as IGroup;
  }
}
