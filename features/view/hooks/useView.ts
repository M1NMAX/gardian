import useLocalStorage from '@hooks/useLocalStorage';


const useView = (key: string) => {
  const [view, setView] = useLocalStorage(key, false);

  return [view, setView] as [typeof view, typeof setView];
};

export default useView;
