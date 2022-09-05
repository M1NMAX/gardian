import React, { FC } from 'react';
import PropertyMenu from './PropertyMenu';
import useModal from '../../hooks/useModal';
import EditPropertyModal from './EditPropertyModal';
import DeleteModal from '../DeleteModal';
import PropertyInput from './PropertyInput';
import { Property, PropertyType } from '@prisma/client';
interface PropertyProps {
  collectionProperty: Property;
  getValue: (id: string) => string;
  setValue: (id: string, value: string) => void;
  onPropertyUpdate: (property: Property) => void;
  onPropertyDuplicate: (property: {
    name: string;
    type: PropertyType;
    values: string[];
  }) => void;
  onPropertyDelete: (id: string) => void;
}

const Property: FC<PropertyProps> = (props) => {
  const {
    collectionProperty,
    getValue,
    setValue,
    onPropertyUpdate,
    onPropertyDuplicate,
    onPropertyDelete,
  } = props;

  const editPropertyModal = useModal();
  const deletePropertyModal = useModal();

  const handleDelete = async () => {
    onPropertyDelete(collectionProperty.id);
    deletePropertyModal.closeModal();
  };

  const handleDuplicate = () => {
    if (!collectionProperty) return;

    const { name, type, values } = collectionProperty;
    onPropertyDuplicate({ name, type, values });
  };

  return (
    <>
      <div className='flex justify-between space-x-0.5 '>
        <PropertyInput
          property={collectionProperty}
          getValue={getValue}
          setValue={setValue}
          menu={
            <PropertyMenu
              onClickEdit={editPropertyModal.openModal}
              onClickDuplicate={handleDuplicate}
              onClickDelete={deletePropertyModal.openModal}
            />
          }
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
          onDelete={handleDelete}>
          <h2>
            Are you sure about delete property{' '}
            <span className='italic'>{collectionProperty.name}</span>? <br />
            This property will be deleted from all items of this collection
          </h2>
        </DeleteModal>
      )}
    </>
  );
};

export default Property;
