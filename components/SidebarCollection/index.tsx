import React, { FC } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, DotsHorizontalIcon, PlusIcon } from '@heroicons/react/outline';


interface SidebarCollectionProps {
  name: string,
  id?: number,
}

const SidebarCollection: FC<SidebarCollectionProps> = ({ name, id }) => {
  return (
    <div className='w-full px-1.5  flex justify-between items-center space-x-1 font-medium rounded-sm hover:bg-gray-200 group '>
      <div className='flex items-center grow truncate'>
        <button>
          <ChevronRightIcon className='icon-xs' />
        </button>
        <Link href={`/collections/${id}`}>
          <a className='grow'>
            <span>
              {name}
            </span>
          </a>
        </Link>
      </div>
      <div className='invisible group-hover:visible flex items-center space-x-1 w-fit '>
        <button>
          <PlusIcon className='icon-xs' />
        </button>
        <button>
          <DotsHorizontalIcon className='icon-xs' />
        </button>
      </div>
    </div>
  )
}

export default SidebarCollection