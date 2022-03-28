import React, { FC } from 'react';
interface BadgeProps {
    text: string,
    variant: "primary" | "secondary"
    rounded?: string
}

const Badge: FC<BadgeProps> = ({ text, variant }) => {
    return (
        <span className='w-fit px-1 font-medium text-xs uppercase
        rounded border bg-gray-200  dark:bg-gray-700'>
            {text}
        </span>
    )
}

export default Badge