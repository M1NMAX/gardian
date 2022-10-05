import React, { FC, ReactNode } from 'react';
import style from './ActionIcon.module.css';


type ActionIconVariants = 'subtle' | 'filled';
interface ActionIconProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: ActionIconVariants;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const ActionIcon: FC<ActionIconProps> = (props) => {
  const { children, type = 'button', variant = 'subtle', onClick } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${style.base} ${style[variant]}`}>
      {children}
    </button>
  );
};

export default ActionIcon;
