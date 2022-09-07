import React, { FC } from 'react';
import { ActionIcon } from '@frontstate-ui';
import { ViewBoardsIcon, ViewGridIcon } from '@heroicons/react/outline';


interface ViewButtonProps {
  value: boolean;
  onClick: () => void;
}

const ViewButton: FC<ViewButtonProps> = (props) => {
  const { value, onClick } = props;
  return (
    <ActionIcon variant='filled' onClick={onClick}>
      {value ? (
        <ViewGridIcon className='icon-sm' />
      ) : (
        <ViewBoardsIcon className='icon-sm rotate-90' />
      )}
    </ActionIcon>
  );
};

export default ViewButton;
