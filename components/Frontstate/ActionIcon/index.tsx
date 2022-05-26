import React, { FC } from 'react';

type ActionIconVariants = 'hover' | 'filled';
interface ActionIconProps {
  icon: JSX.Element;
  variant?: ActionIconVariants;
  rounded?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const getVariantStyle = (variant: ActionIconVariants) => {
  if (variant === 'filled')
    return `p-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 `;

  //Hover is the default
  return `p-1 hover:bg-gray-300 dark:hover:bg-gray-600`;
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
