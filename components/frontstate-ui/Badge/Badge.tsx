import React, { FC } from 'react';

type BadgeVariants = 'outline' | 'filled' | 'light';

const radius = {
  xs: 'rounded-sm',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-full',
};

const sizes = {
  xs: 'h-4 text-xs',
  sm: ' text-sm',
  md: 'h-8 text-base',
  lg: 'h-10 text-lg',
  xl: 'h-12 text-xl',
};

const getVariantStyle = ({
  variant,
  color,
}: {
  variant: BadgeVariants;
  color: string;
}) => {
  if (variant === 'filled') return `bg-green-500 text-white`;
  if (variant === 'outline')
    return `bg-transparent text-green-500 border border-green-400 `;

  // Light is default variant
  return `bg-green-100 dark:bg-green-500/30 text-green-500 dark:text-green-600 `;
};

interface IBadge {
  children: string;
  variant?: BadgeVariants;
  uppercase?: boolean;
  rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'xs' | 'sm' | 'lg' | 'xl';
}

const Badge: FC<IBadge> = (props) => {
  const {
    children,
    variant = 'filled',
    rounded = 'xl',
    size = 'sm',
    uppercase = false,
  } = props;
  const color = 'green';

  return (
    <span
      className={`text-center px-2 font-semibold
        ${uppercase && 'uppercase'}
        ${sizes[size]} 
        ${radius[rounded]}
        ${getVariantStyle({ variant, color })}`}>
      {children}
    </span>
  );
};

export default Badge;
