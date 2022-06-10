import React, { FC } from 'react';
import { MenuAlt1Icon, SelectorIcon } from '@heroicons/react/outline';
import { IProperty, IItemProperty } from '../../interfaces';
import PropertyMenu from './PropertyMenu';
import useModal from '../../hooks/useModal';
import EditPropertyModal from './EditPropertyModal';
import DeleteModal from '../DeleteModal';
interface PropertyProps {
  cProperty?: IProperty;
  itemProperty: IItemProperty;
  onPropertyDelete: (id: number) => void;
}

const Property: FC<PropertyProps> = (props) => {
  const { cProperty, itemProperty, onPropertyDelete } = props;

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
    if (!cProperty) return;
    if (!cProperty._id) return;
    onPropertyDelete(cProperty._id);
    deletePropertyModal.closeModal();
  };

  if (!cProperty) return <></>;
  return (
    <>
      <div className='p-1 rounded border'>
        <span className='flex justify-between'>
          <span className='flex items-center space-x-1 text-sm '>
            {handlePropertyIcon(cProperty.type)}
            <span>{itemProperty.name}</span>
          </span>
          <PropertyMenu
            onClickEdit={editPropertyModal.openModal}
            onClickDelete={deletePropertyModal.openModal}
          />
        </span>
        <p>{itemProperty.value}</p>
      </div>
      {/* Modal  */}
      {editPropertyModal.isOpen && (
        <EditPropertyModal
          open={editPropertyModal.isOpen}
          handleClose={editPropertyModal.closeModal}
          property={cProperty}
        />
      )}
      {deletePropertyModal.isOpen && (
        <DeleteModal
          open={deletePropertyModal.isOpen}
          handleClose={deletePropertyModal.closeModal}
          name={cProperty.name}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default Property;
