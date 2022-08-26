import React, { FC } from 'react';
import style from './Button.module.css';

type ButtonVariantsType =
  | 'primary-filled'
  | 'primary-hover'
  | 'secondary-filled'
  | 'secondary-hover';

interface ButtonProps {
  variant?: ButtonVariantsType;
  type?: 'button' | 'submit' | 'reset';
  full?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    variant = 'secondary-filled',
    type = 'button',
    full = false,
    onClick,
  } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${style.btn} ${style[variant]} ${full && style.full}`}>
      {children}
    </button>
  );
};

export default Button;
