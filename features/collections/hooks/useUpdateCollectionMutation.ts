import { useMutation, useQueryClient } from 'react-query';

const useUpdateCollectionMutation = (
  id: string,
  mutateFun: (value: string) => Promise<void>,
  onSuccessCb: () => void,
  onFailedCb: () => void
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(mutateFun, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sidebarCollection', id]);
      queryClient.invalidateQueries(['collection', id]);
      onSuccessCb();
    },
    onError: () => {
      onFailedCb();
    },
  });

  return mutation.mutate;
};

export default useUpdateCollectionMutation;
