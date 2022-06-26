import React, { FC } from 'react';
import { MenuAlt1Icon, SelectorIcon } from '@heroicons/react/outline';
import { IProperty, IItemProperty } from '../../interfaces';
import PropertyMenu from './PropertyMenu';
import useModal from '../../hooks/useModal';
import EditPropertyModal from './EditPropertyModal';
import DeleteModal from '../DeleteModal';
interface PropertyProps {
  collectionProperty: IProperty;
  itemProperty: IItemProperty;
  getValue: (id: number) => string;
  setValue: (id: number, value: string) => void;
  onPropertyUpdate: (property: IProperty) => void;
  onPropertyDuplicate: (property: IProperty) => void;
  onPropertyDelete: (id: number) => void;
}

const Property: FC<PropertyProps> = (props) => {
  const {
    collectionProperty,
    itemProperty,
    getValue,
    setValue,
    onPropertyUpdate,
    onPropertyDuplicate,
    onPropertyDelete,
  } = props;

  const editPropertyModal = useModal();
  const deletePropertyModal = useModal();

  const handleDelete = async () => {
    if (!collectionProperty) return;
    if (!collectionProperty._id) return;
    onPropertyDelete(collectionProperty._id);
    deletePropertyModal.closeModal();
  };

  const handleDuplicate = () => {
    if (!collectionProperty) return;

    const copy: IProperty = {
      name: collectionProperty.name,
      type: collectionProperty.type,
      values: collectionProperty.values,
      color: collectionProperty.color,
    };
    onPropertyDuplicate(copy);
  };

  return (
    <>
      <div className='p-1 flex justify-between rounded border border-dashed'>
        {collectionProperty.type === 'checkbox'}
        <PropertyInput
          property={collectionProperty}
          getValue={getValue}
          setValue={setValue}
        />
        <PropertyMenu
          onClickEdit={editPropertyModal.openModal}
          onClickDuplicate={handleDuplicate}
          onClickDelete={deletePropertyModal.openModal}
        />
      </div>
      {/* Modal  */}
      {editPropertyModal.isOpen && (
        <EditPropertyModal
          open={editPropertyModal.isOpen}
          handleClose={editPropertyModal.closeModal}
          property={collectionProperty}
          onUpdate={onPropertyUpdate}
        />
      )}
      {deletePropertyModal.isOpen && (
        <DeleteModal
          open={deletePropertyModal.isOpen}
          handleClose={deletePropertyModal.closeModal}
          name={collectionProperty.name}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

interface PropertyInputProps {
  property: IProperty;
  getValue: (id: number) => string;
  setValue: (id: number, value: string) => void;
}
const PropertyInput: FC<PropertyInputProps> = (props) => {
  const { property, getValue, setValue } = props;

  if (!property._id) return <></>;

  switch (property.type) {
    case 'checkbox':
      return (
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            name={property.name}
            checked={getValue(property._id) === 'true'}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.checked ? 'true' : 'false');
            }}
            className='modal-checkbox'
          />
          <span>{property.name}</span>
        </label>
      );
    case 'select':
      return (
        <label className='block'>
          <span className='w-full'> {property.name}</span>
          <select
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.value);
            }}
            className='modal-input'>
            {property.values.map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      );
    case 'textarea':
      return (
        <label className='block'>
          <span className='w-full'>{property.name}</span>
          <textarea
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.value);
            }}
            rows={4}
            maxLength={200}
            className='modal-text-area'
          />
        </label>
      );

    default:
      return (
        <label className='block'>
          <span className='w-full'>{property.name}</span>
          <input
            type={property.type}
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.value);
            }}
            className='modal-input'
          />
        </label>
      );
  }
};

export default Property;
