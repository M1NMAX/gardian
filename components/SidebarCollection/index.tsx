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
    <div className='pl-1 pr-3'>
      <div className={`${id === urlId && 'border-l-4 border-green-400 text-green-400 '} 
        flex items-center justify-between w-full  px-1.5 py-1
       hover:bg-gray-300 dark:hover:bg-gray-600 space-x-1 
        font-semibold  rounded-sm group `}>

        <Link href={`/collections/${id}`}>
          <a className='grow truncate'>
            {name}
          </a>
        </Link>
        <button className='md:invisible md:group-hover:visible btn btn-secodary'>
          <DotsHorizontalIcon className='icon-xs' />
        </button>
      </div>
    </div>
  )
}

export default SidebarCollection