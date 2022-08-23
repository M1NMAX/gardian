import { useMutation, useQueryClient } from 'react-query';

type MutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables
) => Promise<TData>;

const useToggleCollectionProperty = (
  id: string,
  mutateFun: () => Promise<void>,
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

export default useToggleCollectionProperty;
