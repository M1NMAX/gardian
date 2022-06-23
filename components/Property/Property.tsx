import React, { FC } from 'react';
import { MenuAlt1Icon, SelectorIcon } from '@heroicons/react/outline';
import { IProperty, IItemProperty } from '../../interfaces';
import PropertyMenu from './PropertyMenu';
import useModal from '../../hooks/useModal';
import EditPropertyModal from './EditPropertyModal';
import DeleteModal from '../DeleteModal';
interface PropertyProps {
  collectionProperty?: IProperty;
  itemProperty: IItemProperty;
  onPropertyUpdate: (property: IProperty) => void;
  onPropertyDuplicate: (property: IProperty) => void;
  onPropertyDelete: (id: number) => void;
}

const Property: FC<PropertyProps> = (props) => {
  const {
    collectionProperty,
    itemProperty,
    onPropertyUpdate,
    onPropertyDuplicate,
    onPropertyDelete,
  } = props;

  const handlePropertyIcon = (type: string) => {
    let result = <></>;
    switch (type) {
      case 'text':
        result = <MenuAlt1Icon className='icon-xs' />;
        break;

      case 'select':
        result = <SelectorIcon className='icon-xs' />;
        break;
    }

    return result;
  };

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

  if (!collectionProperty) return <></>;
  return (
    <>
      <div className='p-1 flex justify-between rounded border border-dashed'>
        {collectionProperty.type === 'checkbox'}
        <PropertyInput
          property={collectionProperty}
          itemProperty={itemProperty}
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
  itemProperty: IItemProperty;
}
const PropertyInput: FC<PropertyInputProps> = (props) => {
  const { property, itemProperty } = props;

  switch (property.type) {
    case 'checkbox':
      return (
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            name={property.name}
            checked={itemProperty.value === 'true'}
            onChange={(e) => {
              console.log(e.target.value);
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
            value={itemProperty.value}
            onChange={(e) => console.log(e.target.value)}
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
            value={itemProperty.value}
            onChange={(e) => console.log(e.target.value)}
            rows={4}
            maxLength={200}
            className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700'
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
            value={itemProperty.value}
            onChange={(e) => console.log(e.target.value, property._id)}
            className='modal-input'
          />
        </label>
      );
  }
};

export default Property;
