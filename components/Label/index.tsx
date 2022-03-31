import React, { FC } from 'react'

interface LabelProps {
    icon: JSX.Element,
    text: string,
}

const Label: FC<LabelProps> = ({ icon, text }) => {
    return (
        <span className='flex space-x-1'>
            <span className='icon-sm'>
                {icon}
            </span>
            <span>{text}</span>
        </span>
    )
}

export default Label
