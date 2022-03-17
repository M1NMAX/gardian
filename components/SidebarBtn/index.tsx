import React, { FC } from 'react';
import { SidebarBtnProps } from '../../interfaces';

const SidebarBtn: FC<SidebarBtnProps> = ({ icon, text }) => {
    return (
        <button className='w-full space-x-1 btn btn-secondary'>
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
