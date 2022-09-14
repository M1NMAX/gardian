import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCollection } from '../../../features/collections';
import { addCollectionToGroup, deleteGroup, renameGroup } from '../services';

const useGroup = (gid: string) => {
  const queryClient = useQueryClient();

  const invalidateGroupsQueries = useCallback(() => {
    queryClient.invalidateQueries(['groups']);
  }, [gid]);

  const { mutate: createCollectionMutateFun } = useMutation(createCollection, {
    onSuccess: async ({ _id: cid }) => {
      if (!cid) throw 'Collection id is undefined';
      await addCollectionToGroup(gid, cid);
      invalidateGroupsQueries();
      queryClient.invalidateQueries(['collections']);
    },
  });

  const { mutate: renameGroupMutateFun } = useMutation(
    async (name: string) => {
      await renameGroup(gid, name);
    },
    {
      onSuccess: () => invalidateGroupsQueries(),
    }
  );

  const { mutate: deleteGroupMutateFun } = useMutation(deleteGroup, {
    onSuccess: () => invalidateGroupsQueries(),
  });

  return {
    createCollectionMutateFun,
    renameGroupMutateFun,
    deleteGroupMutateFun,
  };
};

export default useGroup;
