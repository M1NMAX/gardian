import React, { FC } from 'react';

interface IconBtnProps {
    icon: JSX.Element,
    tooltipText?: string,
    variant?: "primary" | "secondary",
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void,
}

const IconBtn: FC<IconBtnProps> = ({ icon, tooltipText, variant = "secondary", onClick }) => {
    return (
        <button onClick={onClick} className={`btn btn-${variant}`}>
            <span className='icon-sm'>
                {icon}
            </span>
            <span>
                {tooltipText}
            </span>
        </button>
    )
}

export default IconBtn