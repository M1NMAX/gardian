import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import ThemeBtn from '../ThemeBtn';
import {
  ChevronRightIcon,
  CollectionIcon,
  PlusIcon,
  SearchIcon,
  TemplateIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';
import SidebarLink from './components/SidebarLink';
import ActionIcon from '../Frontstate/ActionIcon';
import SidebarCollection from './components/SidebarCollection';
import SidebarUserOptions from './components/SidebarUserOptions';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useRecoilState } from 'recoil';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { getUserCollections } from '../../fetch/collections';
import { useQuery } from 'react-query';
import { toast, Toaster } from 'react-hot-toast';
import NewCollectionModal from '../NewCollectionModal';
import { useRouter } from 'next/router';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { Disclosure } from '@headlessui/react';

const groups = [
  {
    name: '/',
    collections: [
      { name: 'A1', items: 4 },
      { name: 'A2', items: 2 },
    ],
  },
  { name: 'personal', collections: [{ name: 'B1', items: 4 }] },
  {
    name: 'work',
    collections: [
      { name: 'C1', items: 4 },
      { name: 'C2', items: 4 },
      { name: 'C3', items: 4 },
    ],
  },
];

const Sidebar: FC = () => {
  const router = useRouter();

  

  const { width } = useWindowDimensions();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Menu is open if window width > 768px, tailwind ´md´
  useEffect(() => {
    if (width > 768) setSidebar(true);
  }, [width]);

  const wrapper = useRef<HTMLDivElement>(null);
  //handle outside click in small device
  const checkOutsideClick = useCallback(
    (event) => {
      if (
        sidebar &&
        wrapper.current &&
        !wrapper.current.contains(event.target) &&
        width <= 768
      ) {
        setSidebar(false);
      }
    },
    [sidebar, wrapper, width]
  );

  useEffect(() => {
    document.addEventListener('mousedown', checkOutsideClick);
    return () => document.removeEventListener('mousedown', checkOutsideClick);
  }, [checkOutsideClick]);

  //Modal: create collection
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  


  return (
    <div
      ref={wrapper}
      className={`${sidebar ? 'w-3/4 sm:w-60' : 'w-0'} transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white`}>
      <div className='flex flex-col px-1 py-2  space-y-1 '>
        {/* Top section aka search  */}
        <div className='flex justify-between items-center space-x-1'>
          <button className='w-full space-x-2 flex items-center rounded p-1 bg-gray-300 dark:bg-gray-700'>
            <SearchIcon className='icon-sm' />
            <span>Find, explore</span>
          </button>
          <ThemeBtn />
          <SidebarUserOptions />
        </div>

        <SidebarLink
          icon={<TemplateIcon />}
          text='Templates'
          url='/templates'
          active={router.pathname === '/templates'}
        />

        <SidebarLink
          icon={<CollectionIcon />}
          text='All Collections'
          url='/collections'
          active={router.pathname === '/collections'}
        />
        <div className='space-y-2 mt-2'>
          {groups.map((group) => (
            <Disclosure
              defaultOpen
              as='div'
              className='rounded bg-gray-200  dark:bg-gray-700'>
              {({ open }) => (
                <>
                  <Disclosure.Button className='flex items-center w-full p-1'>
                    <ChevronRightIcon
                      className={`${open ? 'rotate-90 transform' : ''} icon-xs`}
                    />
                    <span> {group.name}</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className='px-4 py-1 text-sm'>
                    {group.collections.map((collection) => (
                      <div>{collection.name}</div>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
        

        {/* Bottom section  */}
        <div className='absolute left-0 right-0 bottom-1 w-full px-1 flex justify-between items-center '>
          <button
            onClick={openModal}
            className='w-full space-x-1 btn btn-secondary'>
            <span className='icon-sm'>
              <PlusIcon />
            </span>
            <span>New Collection</span>
          </button>
          <ActionIcon icon={<ViewGridAddIcon />} />
        </div>
      </div>
      <Toaster />
      {open && (
        <NewCollectionModal
          open={open}
          isSub={false}
          parentName=''
          collectionId={null}
          handleClose={closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
        />
      )}
    </div>
  );
};

export default Sidebar;
