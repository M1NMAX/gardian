import {
  AdjustmentsIcon,
  CalendarIcon,
  CheckCircleIcon,
  CollectionIcon as CIcon,
  DocumentIcon,
} from '@heroicons/react/outline';
import React, { FC } from 'react';

interface ICollectionIcon {
  variant: string;
  iconSize?: 'xs' | 'md';
}

const sizes = {
  xs: 'icon-xs',
  md: 'icon-md',
};

const CollectionIcon: FC<ICollectionIcon> = ({ variant, iconSize = 'md' }) => {
  let result = <></>;
  switch (variant) {
    case 'custom':
      result = <AdjustmentsIcon className={`${sizes[iconSize]} `} />;
      break;
    case 'event':
      result = <CalendarIcon className={`${sizes[iconSize]} `} />;
      break;
    case 'document':
      result = <DocumentIcon className={`${sizes[iconSize]}  `} />;
      break;
    case 'todo':
      result = <CheckCircleIcon className={`${sizes[iconSize]} `} />;
      break;
    case 'collection':
      result = <CIcon className={`${sizes[iconSize]}  `} />;
      break;
  }
  return result;
};

export default CollectionIcon;
