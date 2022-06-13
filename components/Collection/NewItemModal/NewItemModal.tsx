import React, { FC, useEffect, useState } from 'react';
import { addItemToCollection } from '../../../fetch/collections';
import { createItem } from '../../../fetch/item';
import {
  ICollection,
  IItem,
  IItemProperty,
  ModalProps,
} from '../../../interfaces';
import Modal from '../../Frontstate/Modal';

interface NewItemModalProps extends ModalProps {
  collection: ICollection;
}

const NewItemModal: FC<NewItemModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback, collection } =
    props;

  const [name, setName] = useState<string>('');
  const [properties, setProperties] = useState<IItemProperty[]>();
  useEffect(() => {
    if (!collection.properties) return;
    setProperties(
      collection.properties.map((property) => ({
        _id: property._id,
        name: property.name,
        value: '',
      }))
    );
  }, [collection.properties]);

  const getValueById = (id?: number): string => {
    if (!id || !properties) return '';
    return properties.filter((property) => property._id === id)[0].value;
  };

  const setValueById = (value: string, id?: number) => {
    if (!id) return '';
    setProperties(
      properties?.map((property) =>
        property._id === id ? { ...property, value } : property
      )
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!properties || !collection._id) return;

    try {
      const item = await createItem({ name, properties });
      console.log(item);
      if (!item._id) throw true;
      await addItemToCollection(collection._id, item._id);
      positiveFeedback('Item created');
      handleClose();
    } catch (error) {
      console.log(error);
      negativeFeedback();
    }
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
            collection.properties.map((property) => (
              <label key={property._id} className='block'>
                <span className='w-full'>{property.name}</span>

                <input
                  type='text'
                  name={property.name}
                  value={getValueById(property._id)}
                  onChange={(e) => setValueById(e.target.value, property._id)}
                  className='modal-input'
                />
              </label>
            ))}
        </div>

        <div className='flex justify-end space-x-2 mt-2'>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
          <button className='modal-positive-btn'>Create</button>
        </div>
      </form>
    </Modal>
  );
};

export default NewItemModal;
