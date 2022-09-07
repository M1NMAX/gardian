import { useEffect, useState } from 'react';
import { ItemProperty } from '@prisma/client';
import { getItem } from '../services';


const useGetItem = (id: string) => {
  const [name, setName] = useState('');
  const [properties, setProperties] = useState<ItemProperty[]>([]);

  const fetchItem = async () => {
    try {
      const item = await getItem(id);
      setName(item.name);
      setProperties(item.properties);
    } catch (error) {
      console.log(error);
    }
  };

  const refetch = () => fetchItem();
  useEffect(() => {
    fetchItem();
  }, [id]);

  const setPropertyValue = (pid: string, value: string) => {
    setProperties(
      properties.map((property) =>
        property.id === pid ? { ...property, value } : property
      )
    );
  };

  const getPropertyValue = (pid: string) => {
    const property = properties.find((property) => property.id === pid);
    return property ? property.value : '';
  };

  return { name, properties, getPropertyValue, setPropertyValue, refetch };
};

export default useGetItem;
