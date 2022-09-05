import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  addPropertyToCollection,
  changeCollectionIcon,
  deleteCollection,
  getCollection,
  removePropertyFromCollection,
  renameCollection,
  toggleCollectionDescriptionState,
  toggleCollectionIsFavourite,
  updateCollectionDescription,
  updateCollectionProperty,
} from '../services';
import {
  addPropertyToItem,
  createItem,
  getItems,
  removePropertyFromItem,
} from '../../items/services';

import { Property } from '@prisma/client';

const useCollection = (cid: string, key: string = 'collection') => {
  const queryClient = useQueryClient();

  const invalidateCollectionQueries = () => {
    queryClient.invalidateQueries(['sidebarCollection', cid]);
    queryClient.invalidateQueries(['collection', cid]);
  };

  const invalidateItemsQueries = () => {
    queryClient.invalidateQueries(['items', cid]);
  };

  const query = useQuery([key, cid], () => getCollection(cid));

  const { mutate: createItemMutateFun } = useMutation(createItem, {
    onSuccess: async () => {
      invalidateCollectionQueries();
      invalidateItemsQueries();
    },
  });

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

  const { mutate: changeCollectionIconMutateFun } = useMutation(
    async (icon: string) => {
      await changeCollectionIcon(cid, icon);
    },
    { onSuccess: () => invalidateCollectionQueries() }
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
    onSuccess: async () => {
      queryClient.removeQueries(['sidebarCollection', cid]);
      queryClient.removeQueries(['collection', cid]);
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['collections']);
    },
  });

  //Property
  const { mutate: addPropertyToCollectionMutateFun } = useMutation(
    addPropertyToCollection,
    {
      onSuccess: async (data) => {
        const { id, properties } = data;

        //get the lastest Collection property base on creation date
        const lastestProperty = properties.reduce((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt) : Date.now;
          const bDate = b.createdAt ? new Date(b.createdAt) : Date.now;
          return aDate > bDate ? a : b;
        });

        const items = await getItems(id);

        // add placeholder for this property into collection items
        items.map(async ({ id }) => {
          await addPropertyToItem(id, {
            id: lastestProperty.id,
            value: '',
          });
        });

        invalidateCollectionQueries();
        invalidateItemsQueries();
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
      onSuccess: async ({ pid }) => {
        if (!query.data) throw 'Collection is undefined';

        const items = await getItems(query.data.id);

        //Remove property from collection items
        items.map(async ({ id }) => {
          await removePropertyFromItem(id, pid);
        });
        invalidateCollectionQueries();
        invalidateItemsQueries();
      },
    }
  );

  const getCollectionPropertyById = (pid: string) => {
    if (!query.data) return {} as Property;
    const property = query.data.properties.find(
      (property) => property.id === pid
    );

    return property || ({} as Property);
  };

  return {
    query,
    createItemMutateFun,
    getCollectionPropertyById,
    toggleIsFavStateMutateFun,
    toggleDescrStateMutateFun,
    changeCollectionIconMutateFun,
    renameCollectionMutateFun,
    updCollectionDescrMutateFun,
    deleteCollectionMutateFun,
    addPropertyToCollectionMutateFun,
    updateCollectionPropertyMutateFun,
    deleteCollectionPropertyMutateFun,
  };
};
export default useCollection;
