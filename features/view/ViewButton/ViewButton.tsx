import { Button, Tooltip } from 'flowbite-react';
import React, { FC } from 'react';
import { Squares2X2Icon, ViewColumnsIcon } from '@heroicons/react/24/outline';


interface ViewButtonProps {
  isGrid: boolean;
  onClick: () => void;
}

const ViewButton: FC<ViewButtonProps> = (props) => {
  const { isGrid, onClick } = props;
  return (
    <Tooltip content={isGrid ? 'List view' : 'Grid view'}>
      <Button color='gray' onClick={onClick}>
        {isGrid ? (
          <ViewColumnsIcon className='icon-sm rotate-90' />
        ) : (
          <Squares2X2Icon className='icon-sm' />
        )}
      </Button>
    </Tooltip>
  );
};

export default ViewButton;
