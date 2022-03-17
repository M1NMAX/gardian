import React, { FC } from 'react';
import { CollectionProps } from '../../interfaces';


const Collection: FC<CollectionProps> = ({ collection }) => {
  return (
    <div className='flex space-x-2'>
      <span>
        {collection.variant}
      </span>
      <span>{collection.owner_id}</span>
    </div>
  )
}

export default Collection