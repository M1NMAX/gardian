import React, { FC } from 'react';

interface IconBtnProps {
    icon: JSX.Element,
    tooltipText?: string,
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void,
}

const IconBtn: FC<IconBtnProps> = ({ icon, tooltipText, onClick }) => {
    return (
        <button onClick={onClick} className='btn btn-secondary'>
            <span className='icon-md'>
                {icon}
            </span>
            <span>
                {tooltipText}
            </span>
        </button>
    )
}

export default IconBtn