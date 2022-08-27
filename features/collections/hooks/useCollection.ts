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
import { removeCollectionFromGroup } from '../../../services/group';
import {
  addPropertyToItem,
  deleteItem,
  removePropertyFromItem,
} from '../../../services/item';

const useCollection = (
  cid: string,
  gid: string,
  key: string = 'collection'
) => {
  const queryClient = useQueryClient();

  const invalidateCollectionQueries = () => {
    queryClient.invalidateQueries(['sidebarCollection', cid]);
    queryClient.invalidateQueries(['collection', cid]);
  };

  const invalidateItemsQueries = () => {
    queryClient.invalidateQueries(['items', cid]);
  };

  const query = useQuery<ICollection>([key, cid], () => getCollection(cid));

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
    onSuccess: async () => {
      if (!query.data) throw 'Collection is undefined';
      const { items } = query.data;
      //Delete all collection items
      items.map(async (itemId) => await deleteItem(itemId));
      await removeCollectionFromGroup(gid, cid);

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
        const { items, properties } = data;

        //get the lastest Collection property base on creation date
        const lastestProperty = properties.reduce((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt) : Date.now;
          const bDate = b.createdAt ? new Date(b.createdAt) : Date.now;
          return aDate > bDate ? a : b;
        });

        // add placeholder for this property into collection items
        items.map(async (itemId) => {
          await addPropertyToItem(itemId, {
            _id: lastestProperty._id,
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
      onSuccess: ({ propertyId }) => {
        if (!query.data) throw 'Collection is undefined';
        const { items } = query.data;
        //Remove property from collection items
        items.map(async (itemId) => {
          await removePropertyFromItem(itemId, propertyId);
        });
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
