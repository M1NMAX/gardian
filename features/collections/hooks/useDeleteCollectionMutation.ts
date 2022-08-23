import { useMutation, useQueryClient } from 'react-query';
import { deleteCollection } from '../../../services/collections';

const useDeleteCollectionMutation = (
  id: string,
  onSuccessCb: () => void,
  onFailedCb: () => void
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(deleteCollection, {
    onSuccess: () => {
      queryClient.removeQueries(['sidebarCollection', id]);
      queryClient.removeQueries(['collection', id]);
      onSuccessCb();
    },
    onError: () => {
      onFailedCb();
    },
  });

  return mutation;
};

export default useDeleteCollectionMutation;
