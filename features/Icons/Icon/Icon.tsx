import React, { FC } from 'react';
import iconList from '../iconList';


interface IconProps {
  iconId: string;
}
const Icon: FC<IconProps> = (props) => {
  const { iconId } = props;

  const { component } = iconList[iconId];
  return <span className='icon-xs'>{component}</span>;
};

export default Icon;
