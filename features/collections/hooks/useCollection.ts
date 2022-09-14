import {
  addPropertyToItem,
  createItem,
  getItems,
  removePropertyFromItem
} from '@features/items/services';
import { Icon, Property } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addPropertyToCollection,
  changeCollectionIcon,
  createCollection,
  deleteCollection,
  getCollection,
  moveCollection,
  removePropertyFromCollection,
  renameCollection,
  toggleCollectionDescriptionState,
  toggleCollectionIsFavourite,
  updateCollectionDescription,
  updateCollectionProperty
} from '../services';


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
    async (icon: Icon) => {
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

  const { mutate: moveCollectionMutateFun } = useMutation(
    async (desGroupId: string) => {
      await moveCollection(cid, desGroupId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groups']);
        invalidateCollectionQueries();
      },
    }
  );
  const { mutate: duplicateCollectionMutateFun } = useMutation(
    createCollection,
    {
      onSuccess: async ({ id: newCollectionId }) => {
        //get all items of current collection
        const items = await getItems(cid);

        //duplicate  every item and add new collection as parent
        items.map(async (item) => {
          const { name, properties } = item;
          await createItem({ name, properties, collectionId: newCollectionId });
        });

        queryClient.invalidateQueries(['groups']);
        queryClient.invalidateQueries(['collections']);
      },
    }
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
        const { id: cid, properties } = data;

        //get the lastest Collection property base on creation date
        const lastestProperty = properties.reduce((a, b) => {
          return a.createdAt > b.createdAt ? a : b;
        });

        const items = await getItems(cid);

        // add placeholder for this property into collection items
        for (const item of items) {
          await addPropertyToItem(item.id, {
            id: lastestProperty.id,
            value: '',
          });
        }

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
        for (const item of items) {
          await removePropertyFromItem(item.id, pid);
        }

        invalidateCollectionQueries();
        invalidateItemsQueries();
      },
    }
  );

  const getPropertyById = (pid: string) => {
    if (!query.data) return {} as Property;
    const property = query.data.properties.find(
      (property) => property.id === pid
    );

    return property || ({} as Property);
  };

  return {
    query,
    createItemMutateFun,
    getPropertyById,
    toggleIsFavStateMutateFun,
    toggleDescrStateMutateFun,
    changeCollectionIconMutateFun,
    renameCollectionMutateFun,
    updCollectionDescrMutateFun,
    moveCollectionMutateFun,
    duplicateCollectionMutateFun,
    deleteCollectionMutateFun,
    addPropertyToCollectionMutateFun,
    updateCollectionPropertyMutateFun,
    deleteCollectionPropertyMutateFun,
  };
};
export default useCollection;
