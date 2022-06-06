import React, { FC } from 'react';
import { MenuAlt1Icon, SelectorIcon } from '@heroicons/react/outline';
import { IProperty, IItemProperty } from '../../interfaces';
import PropertyMenu from './PropertyMenu';
import useModal from '../../hooks/useModal';
import EditPropertyModal from './EditPropertyModal';
interface PropertyProps {
  cProperty?: IProperty;
  itemProperty: IItemProperty;
}

const Property: FC<PropertyProps> = (props) => {
  const { cProperty, itemProperty } = props;

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

  if (!cProperty) return <></>;
  return (
    <>
      <div className='p-1 rounded border'>
        <span className='flex justify-between'>
          <span className='flex items-center space-x-1 text-sm '>
            {handlePropertyIcon(cProperty.type)}
            <span>{itemProperty.name}</span>
          </span>
          <PropertyMenu onClickEdit={editPropertyModal.openModal} />
        </span>
        <p>{itemProperty.value}</p>
      </div>
      {editPropertyModal.isOpen && (
        <EditPropertyModal
          open={editPropertyModal.isOpen}
          handleClose={editPropertyModal.closeModal}
          property={cProperty}
        />
      )}
    </>
  );
};

export default Property;
