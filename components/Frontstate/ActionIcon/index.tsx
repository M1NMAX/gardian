import React, { FC } from 'react';

type ActionIconVariants = 'hover' | 'filled';
interface ActionIconProps {
  icon: JSX.Element;
  variant?: ActionIconVariants;
  rounded?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const getVariantStyle = (variant: ActionIconVariants) => {
  if (variant === 'filled') return `action-icon-filled-variant`;

  //Hover is the default
  return `action-icon-hover-variant`;
};

const ActionIcon: FC<ActionIconProps> = (props) => {
  const { icon, variant = 'hover', rounded = true, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`flex items-center ${rounded && 'rounded'} ${getVariantStyle(
        variant
      )}`}>
      <span className='icon-sm'>{icon}</span>
    </button>
  );
};

export default ActionIcon;
