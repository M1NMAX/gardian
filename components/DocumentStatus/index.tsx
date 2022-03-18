import React, { FC } from 'react';
import { BadgeCheckIcon, ExclamationIcon, XCircleIcon } from '@heroicons/react/outline';
import { DocumentStatusProps } from '../../interfaces';

const DocumentStatus: FC<DocumentStatusProps> = ({ name, isSaved, error }) => {
    return (
        <>

            <div className='flex space-x-1 uppercase'>

                {isSaved ?
                    <span className='flex items-center text-green-500 border rounded border-green-500 px-1'>
                        <BadgeCheckIcon className='icon-sm' />saved
                    </span> :
                    <span className='flex items-center text-yellow-500 border rounded border-yellow-500 px-1'>
                        <ExclamationIcon className='icon-sm' />unsaved
                    </span>
                }
                {error && <span className='flex items-center text-red-500 border rounded border-red-500 px-1'>
                    <XCircleIcon className='icon-sm' /> Error
                </span>}
            </div>
            <span className='px-2 truncate'>
                {name}
            </span>
        </>
    )
}

export default DocumentStatus