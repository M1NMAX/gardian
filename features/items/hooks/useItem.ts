import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem, renameItem, updateItemProperty } from '../services';


const useItem = (id: string, cid: string) => {
  const queryClient = useQueryClient();

  const invalidateItemsQueries = () => {
    queryClient.invalidateQueries(['items', cid]);
  };

  const invalidateCollectionQueries = () => {
    queryClient.invalidateQueries(['collection', cid]);
    queryClient.invalidateQueries(['sidebarCollection', cid]);
  };

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
    onSuccess: async () => {
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
