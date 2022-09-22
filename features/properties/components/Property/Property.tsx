import React, { FC } from 'react';
import DeleteModal from '@components/DeleteModal';
import useModal from '@hooks/useModal';
import { Option, Property as PropertyModel, PropertyType } from '@prisma/client';
import EditPropertyModal from '../EditPropertyModal';
import PropertyInput from '../PropertyInput';
import PropertyMenu from '../PropertyMenu';


interface PropertyProps {
  collectionProperty: PropertyModel;
  getValue: (id: string) => string;
  setValue: (id: string, value: string) => void;
  onPropertyUpdate: (property: PropertyModel) => void;
  onPropertyDuplicate: (property: {
    name: string;
    type: PropertyType;
    options: Option[];
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
    const { name, type, options } = collectionProperty;
    onPropertyDuplicate({ name, type, options });
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
