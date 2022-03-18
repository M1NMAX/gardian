import React, { FC } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, DotsHorizontalIcon, PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';


interface SidebarCollectionProps {
  name: string,
  id?: number,
}

const SidebarCollection: FC<SidebarCollectionProps> = ({ name, id }) => {
  const router = useRouter();
  const { id: urlId } = router.query;



  return (
    <div className={`${id === urlId && 'border-l-4 border-green-400 text-green-400 '} 
      w-full pl-1 pr-3 justify-between btn hover:bg-gray-300 dark:hover:bg-gray-600 space-x-1 font-medium  group `}>
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