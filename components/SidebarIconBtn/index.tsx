import React, { FC } from 'react';

interface SidebarIconBtnProps {
    icon: JSX.Element,
    tooltipText?: string,
}

const SidebarIconBtn: FC<SidebarIconBtnProps> = ({ icon, tooltipText }) => {
    return (
        <button className='flex rounded hover:bg-gray-300'>
            <span className='icon-md'>
                {icon}
            </span>
            <span>
                {tooltipText}
            </span>
        </button>
    )
}

export default SidebarIconBtn