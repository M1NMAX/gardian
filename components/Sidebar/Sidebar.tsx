import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import ThemeBtn from '../ThemeBtn';
import {
  ChevronRightIcon,
  CollectionIcon,
  DotsVerticalIcon,
  PlusIcon,
  SearchIcon,
  TemplateIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';
import SidebarLink from './SidebarLink';
import ActionIcon from '../Frontstate/ActionIcon';
import SidebarCollection from './SidebarCollection';
import SidebarUserOptions from './SidebarUserMenu';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useRecoilState } from 'recoil';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useQuery } from 'react-query';
import { toast, Toaster } from 'react-hot-toast';
import NewCollectionModal from '../NewCollectionModal';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';
import useModal from '../../hooks/useModal';
import CreateGroupModal from '../CreateGroupModal';
import { IGroup } from '../../interfaces';
import { getGroups } from '../../fetch/group';

const Sidebar: FC = () => {
  const router = useRouter();

  const { data: groups } = useQuery<IGroup[], Error>(['groups'], getGroups);

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

  const createGroupModal = useModal();

  return (
    <div
      ref={wrapper}
      className={`${sidebar ? 'w-3/4 sm:w-60' : 'w-0'} transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white`}>
      <div className='flex flex-col py-2  space-y-1 '>
        {/* Top section aka search  */}
        <div className='flex justify-between items-center space-x-1 px-2'>
          <button className='w-full space-x-2 flex items-center rounded p-1 bg-gray-300 dark:bg-gray-700'>
            <SearchIcon className='icon-sm' />
            <span>Find, explore</span>
          </button>

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
          text='My Collections'
          url='/collections'
          active={router.pathname === '/collections'}
        />
        <div className='space-y-2 px-2'>
          {groups?.map((group) => (
            <Disclosure
              defaultOpen
              as='div'
              className='rounded bg-gray-200  dark:bg-gray-700 mt-2'>
              {({ open }) => (
                <>
                  <div className='flex justify-between py-0.5 pr-2'>
                    <Disclosure.Button className='flex items-center w-full p-0.5'>
                      <ChevronRightIcon
                        className={`${
                          open ? 'rotate-90 transform' : ''
                        } icon-xs`}
                      />
                      <span> {group.name}</span>
                    </Disclosure.Button>
                    <button
                      className='flex items-center justify-center px-1 
                    rounded hover:bg-gray-300 dark:hover:bg-gray-600'>
                      <DotsVerticalIcon className='icon-xs' />
                    </button>
                  </div>
                  {group.collections.length > 0 && (
                    <Disclosure.Panel className='py-1 text-sm'>
                      {group.collections.map(
                        (collectionId) =>
                          group._id && (
                            <SidebarCollection
                              key={collectionId}
                              collectionId={collectionId}
                              groupId={group._id}
                            />
                          )
                      )}
                    </Disclosure.Panel>
                  )}
                </>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Bottom section  */}
        <div
          className='absolute left-0 right-0 bottom-1 w-full px-1 
        grid grid-cols-6 gap-2  '>
          <ThemeBtn />
          <div className='col-span-5 flex  border-l-2 pl-2 border-gray-200 dark:border-gray-700'>
            <button
              onClick={openModal}
              disabled={groups?.length === 0}
              className='w-full space-x-1 btn btn-secondary 
              disabled:cursor-no-drop disabled:invisible'>
              <span className='icon-sm'>
                <PlusIcon />
              </span>
              <span>New Collection</span>
            </button>
            <ActionIcon
              icon={<ViewGridAddIcon />}
              onClick={() => createGroupModal.openModal()}
            />
          </div>
        </div>
      </div>
      <Toaster />
      {open && groups && (
        <NewCollectionModal
          open={open}
          handleClose={closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
          groups={groups}
        />
      )}

      {createGroupModal.isOpen && (
        <CreateGroupModal
          open={createGroupModal.isOpen}
          handleClose={createGroupModal.closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
        />
      )}
    </div>
  );
};

export default Sidebar;
