import React, { FC, ReactNode } from 'react';
import style from './Button.module.css';


type ButtonVariantsType =
  | 'primary-filled'
  | 'primary-hover'
  | 'secondary-filled'
  | 'secondary-hover'
  | 'danger-filled';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariantsType;
  type?: 'button' | 'submit' | 'reset';
  full?: boolean;
  isDisabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    variant = 'secondary-filled',
    type = 'button',
    full = false,
    isDisabled = false,
    onClick,
  } = props;
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${style.btn} ${style[variant]} ${full && style.full}`}>
      {children}
    </button>
  );
};

export default Button;
