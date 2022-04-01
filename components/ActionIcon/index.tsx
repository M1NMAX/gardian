import React, { FC } from 'react';

interface ActionIconProps {
    icon: JSX.Element,
    variant?: "primary" | "secondary",
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void,
}

const ActionIcon: FC<ActionIconProps> = ({ icon, variant = "secondary", onClick }) => {
    return (
        <button onClick={onClick} className={`btn btn-${variant}`}>
            <span className='icon-sm'>
                {icon}
            </span>
        </button>
    )
}

export default ActionIcon