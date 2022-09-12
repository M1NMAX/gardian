import React, { FC, ReactNode } from 'react';
import { Icon } from '@prisma/client';
import iconList from '../../iconList';
import style from './Icon.module.css';


interface IconProps {
  icon: Icon;
  defaultIcon: ReactNode;
  big?: boolean;
}
const Icon: FC<IconProps> = (props) => {
  const { icon, defaultIcon, big = false } = props;
  const { name, variant } = icon;

  return (
    <>
      {name === '' || typeof iconList[name] == undefined ? (
        <span className={`${big ? 'icon-lg' : 'icon-sm'}`}> {defaultIcon}</span>
      ) : (
        <span className={`${style[variant]} ${big ? 'icon-lg' : 'icon-sm'}`}>
          {iconList[name].component}
        </span>
      )}
    </>
  );
};

export default Icon;