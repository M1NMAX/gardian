import React, { FC } from 'react';
import { ActionIcon } from '@frontstate-ui';
import { Squares2X2Icon, ViewColumnsIcon } from '@heroicons/react/24/outline';


interface ViewButtonProps {
  value: boolean;
  onClick: () => void;
}

const ViewButton: FC<ViewButtonProps> = (props) => {
  const { value, onClick } = props;
  return (
    <ActionIcon variant='filled' onClick={onClick}>
      {value ? (
        <Squares2X2Icon className='icon-sm' />
      ) : (
        <ViewColumnsIcon className='icon-sm rotate-90' />
      )}
    </ActionIcon>
  );
};

export default ViewButton;
