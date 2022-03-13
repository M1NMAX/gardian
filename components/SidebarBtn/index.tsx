import React, { FC } from 'react';

interface SidebarBtnProps {
    icon: JSX.Element,
    text: string,
}

const SidebarBtn: FC<SidebarBtnProps> = ({ icon, text }) => {
    return (
        <button className='w-full flex space-x-1 font-medium rounded-sm hover:bg-gray-300'>
            <span className='icon-sm'>
                {icon}
            </span>
            <span>
                {text}
            </span>
        </button>
    )
}
export default SidebarBtn;
