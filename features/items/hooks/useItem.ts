import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  deleteItem,
  renameItem,
  updateItemProperty,
} from '../../../services/item';

const useItem = (id: string, cid: string) => {
  const queryClient = useQueryClient();

  const invalidateItemsQueries = useCallback(() => {
    queryClient.invalidateQueries(['items', cid]);
  }, [cid]);

  const invalidateCollectionQueries = useCallback(() => {
    queryClient.invalidateQueries(['collection', cid]);
    queryClient.invalidateQueries(['sidebarCollection', cid]);
  }, [id, cid]);

  const { mutate: renameItemMutateFun } = useMutation(
    async (name: string) => {
      await renameItem(id, name);
    },
    {
      onSuccess: () => {
        invalidateItemsQueries();
      },
    }
  );
  const { mutate: deleteItemMutateFun } = useMutation(deleteItem, {
    onSuccess: () => {
      invalidateCollectionQueries();
      invalidateItemsQueries();
    },
  });

  //Property
  const { mutate: updateItemPropertyMutateFun } = useMutation(
    updateItemProperty,
    {
      onSuccess: () => {
        invalidateItemsQueries();
      },
    }
  );

  return {
    renameItemMutateFun,
    deleteItemMutateFun,
    updateItemPropertyMutateFun,
  };
};

export default useItem;
