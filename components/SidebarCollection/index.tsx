import React, { FC } from 'react';
import Link from 'next/link';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import GenericMenu from '../GenericMenu';


interface SidebarCollectionProps {
  name: string,
  variant: string
  id?: number,
}

const SidebarCollection: FC<SidebarCollectionProps> = ({ id, name, variant }) => {
  const router = useRouter();
  const { id: urlId } = router.query;


  return (
    <div className='pl-1 pr-2.5'>
      <div className={`${id === urlId && 'border-l-4 border-green-400 text-green-400 '} 
        flex items-center justify-between w-full  px-1.5 py-1
       hover:bg-gray-300 dark:hover:bg-gray-600 space-x-1 
        font-semibold  rounded-sm group `}>

        <Link href={`/collections/${id}`}>
          <a className='flex flex-col justify-center grow truncate'>
            <span>
              {name}
            </span>
            <span className='text-xs font-light'> {variant}s</span>
          </a>
        </Link>

        <div className='md:invisible md:group-hover:visible '>
          <GenericMenu onClickRename={() => { console.log("mfm") }} onClickDelete={() => { console.log("mfm") }} />
        </div>
      </div>
    </div>
  )
}

export default SidebarCollection