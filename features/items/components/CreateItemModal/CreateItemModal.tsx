import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addItemToCollection } from '../../../../fetch/collections';
import { createItem } from '../../../../fetch/item';
import { ICollection, IItemProperty } from '../../../../interfaces';
import { Modal } from '../../../../components/frontstate-ui';
import PropertyInput from './PropertyInput';

interface CreateItemModalProps {
  collection: ICollection;
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  positiveFeedback: (value: string) => void;
  negativeFeedback: () => void;
}

const CreateItemModal: FC<CreateItemModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback, collection } =
    props;

  const [name, setName] = useState<string>('');
  const [properties, setProperties] = useState<IItemProperty[]>();

  useEffect(() => {
    setProperties(
      collection.properties.map((property) => ({
        _id: property._id,
        value: '',
      }))
    );
  }, [collection.properties]);

  const getValueById = (id?: string): string => {
    if (!id || !properties) return '';
    const property = properties.find((property) => property._id === id);

    return property ? property.value : '';
  };

  const setValueById = (value: string, id?: string) => {
    if (!id || !properties) return;
    setProperties(
      properties.map((property) =>
        property._id === id ? { ...property, value } : property
      )
    );
  };

  const queryClient = useQueryClient();

  const { mutate: addNewItemMutation } = useMutation(createItem, {
    onSuccess: async (data) => {
      if (!collection._id) throw 'Collection._id is undefined';
      if (!data._id) throw 'Item._id is undefined';

      await addItemToCollection(collection._id, data._id);

      queryClient.invalidateQueries(['collection', collection._id]);
      queryClient.invalidateQueries(['items', collection._id]);

      positiveFeedback('Item created');
    },
    onError: (error) => {
      negativeFeedback();
      console.log(error);
    },
    onSettled: () => handleClose(),
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!properties || !collection._id) return;

    addNewItemMutation({ name, properties });
  };

  return (
    <Modal title='New Item' open={open} onHide={handleClose}>
      <form onSubmit={handleSubmit} className='space-y-2'>
        <label className='block'>
          <span className='w-full'>Name</span>
          <input
            type='text'
            name='name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder='Item name'
            className='modal-input'
          />
        </label>

        <div className='flex flex-col'>
          {collection.properties &&
            collection.properties.map((property, idx) => (
              <PropertyInput
                key={idx}
                property={property}
                getValue={getValueById}
                setValue={setValueById}
              />
            ))}
        </div>

        <div className='flex justify-end space-x-2 mt-2'>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
          <button disabled={name.length === 0} className='modal-positive-btn'>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateItemModal;
