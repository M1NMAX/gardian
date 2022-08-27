import { useCallback, useEffect, useState } from 'react';
import { IItemProperty } from '../../../interfaces';
import { getItem } from '../services';

const useGetItem = (id: string) => {
  const [name, setName] = useState('');
  const [properties, setProperties] = useState<IItemProperty[]>([]);

  const fetchItem = useCallback(async () => {
    try {
      const item = await getItem(id);
      setName(item.name);
      setProperties(item.properties);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const refetch = () => fetchItem();

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const setPropertyValue = (pid: string, value: string) => {
    setProperties(
      properties.map((property) =>
        property._id === pid ? { ...property, value } : property
      )
    );
  };

  const getPropertyValue = (pid: string) => {
    const property = properties.find((property) => property._id === pid);
    return property ? property.value : '';
  };

  return { name, properties, getPropertyValue, setPropertyValue, refetch };
};

export default useGetItem;
