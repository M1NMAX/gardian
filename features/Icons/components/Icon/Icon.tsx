import React, { FC, ReactNode } from 'react';
import { Icon as IconModel } from '@prisma/client';
import iconList from '../../iconList';
import style from './Icon.module.css';

interface IconProps {
  icon: IconModel;
  defaultIcon: ReactNode;
  big?: boolean;
}
const Icon: FC<IconProps> = (props) => {
  const { icon, defaultIcon, big = false } = props;
  const { name, color } = icon;

  return (
    <>
      {name === '' || typeof iconList[name] == undefined ? (
        <span className={`${big ? 'icon-lg' : 'icon-sm'}`}> {defaultIcon}</span>
      ) : (
        <span
          className={`${style[color.toLowerCase()]} ${
            big ? 'icon-lg' : 'icon-sm'
          }`}>
          {iconList[name].component}
        </span>
      )}
    </>
  );
};

export default Icon;
