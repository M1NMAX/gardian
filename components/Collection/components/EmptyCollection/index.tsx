import { InboxIcon } from '@heroicons/react/outline'
import React from 'react'

const EmptyCollection = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <InboxIcon className='icon-3xl' />
            <p> Wow, such empty </p>
            <span>There are no item in this collection</span>
        </div>
    )
}

export default EmptyCollection