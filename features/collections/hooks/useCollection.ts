import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ICollection, IProperty } from '../../../interfaces';
import {
  addPropertyToCollection,
  deleteCollection,
  getCollection,
  removePropertyFromCollection,
  renameCollection,
  toggleCollectionDescriptionState,
  toggleCollectionIsFavourite,
  updateCollectionDescription,
  updateCollectionProperty,
} from '../../../services/collections';

const useCollection = (cid: string) => {
  const queryClient = useQueryClient();

  const invalidateCollectionQueries = useCallback(() => {
    queryClient.invalidateQueries(['sidebarCollection', cid]);
    queryClient.invalidateQueries(['collection', cid]);
  }, [cid]);

  const invalidateItemsQueries = useCallback(() => {
    queryClient.invalidateQueries(['items', cid]);
  }, [cid]);

  const query = useQuery<ICollection>(['collection', cid], () =>
    getCollection(cid)
  );

  const { mutate: toggleIsFavStateMutateFun } = useMutation(
    toggleCollectionIsFavourite,
    {
      onSuccess: () => invalidateCollectionQueries(),
    }
  );

  const { mutate: toggleDescrStateMutateFun } = useMutation(
    toggleCollectionDescriptionState,
    {
      onSuccess: () => invalidateCollectionQueries(),
    }
  );

  const { mutate: renameCollectionMutateFun } = useMutation(
    async (name: string) => {
      await renameCollection(cid, name);
    },
    { onSuccess: () => invalidateCollectionQueries() }
  );

  const { mutate: updCollectionDescrMutateFun } = useMutation(
    async (description: string) => {
      await updateCollectionDescription(cid, description);
    },
    { onSuccess: () => invalidateCollectionQueries() }
  );

  const { mutate: deleteCollectionMutateFun } = useMutation(deleteCollection, {
    onSuccess: () => {
      queryClient.removeQueries(['sidebarCollection', cid]);
      queryClient.removeQueries(['collection', cid]);
    },
  });

  //Property
  const { mutate: addPropertyToCollectionMutateFun } = useMutation(
    addPropertyToCollection,
    {
      onSuccess: () => {
        invalidateCollectionQueries();
      },
    }
  );

  const { mutate: updateCollectionPropertyMutateFun } = useMutation(
    updateCollectionProperty,
    {
      onSuccess: () => {
        invalidateCollectionQueries();
        invalidateItemsQueries();
      },
    }
  );

  const { mutate: deleteCollectionPropertyMutateFun } = useMutation(
    removePropertyFromCollection,
    {
      onSuccess: () => {
        invalidateCollectionQueries();
        invalidateItemsQueries();
      },
    }
  );

  const getCollectionPropertyById = (pid: string) => {
    if (!query.data) return {} as IProperty;
    const property = query.data.properties.find(
      (property) => property._id === pid
    );

    return property || ({} as IProperty);
  };

  return {
    query,
    getCollectionPropertyById,
    toggleIsFavStateMutateFun,
    toggleDescrStateMutateFun,
    renameCollectionMutateFun,
    updCollectionDescrMutateFun,
    deleteCollectionMutateFun,
    addPropertyToCollectionMutateFun,
    updateCollectionPropertyMutateFun,
    deleteCollectionPropertyMutateFun,
  };
};
export default useCollection;
