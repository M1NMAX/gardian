import React, { FC } from 'react';
interface BadgeProps {
    text: string,
    variant: "primary" | "secondary"
    icon?: JSX.Element,
    uppercase?: boolean,
    rounded?: "xs" | "sm" | "md" | "lg",
    textSize?: "xs" | "sm" | "lg" | "xl"
}

const Badge: FC<BadgeProps> = ({ text, variant, icon, uppercase, rounded, textSize }) => {
    return (
        <span className={`flex items-center w-fit px-1 font-medium 
        ${textSize && 'text-' + textSize} 
        ${uppercase && 'uppercase'}
        ${rounded ? 'rounded-' + rounded : 'rounded'} 
        border bg-gray-200  dark:bg-gray-700`}>
            {icon}
            <span>
                {text}
            </span>
        </span>
    )
}

export default Badge