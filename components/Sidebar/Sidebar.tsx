import React, { FC, useCallback, useEffect, useRef } from 'react';
import { ThemeBtn } from '../../features/theme';
import {
  CollectionIcon,
  PlusIcon,
  SearchIcon,
  TemplateIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';
import SidebarBtn from './SidebarBtn';
import { ActionIcon } from '../frontstate-ui';
import SidebarCollection from './SidebarCollection';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useRecoilState } from 'recoil';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useQuery } from 'react-query';
import { toast, Toaster } from 'react-hot-toast';
import { CreateCollectionModal } from '../../features/collections';
import { useRouter } from 'next/router';
import useModal from '../../hooks/useModal';
import CreateGroupModal from '../CreateGroupModal';
import { IGroup } from '../../interfaces';
import { getGroups } from '../../services/group';
import SidebarGroup from './SidebarGroup';
import SearchModal from '../SearchModal';
import SidebarUserPopoverMenu from './SidebarUserPopoverMenu';
import { SCREEN_SIZE_MD } from '../../constants';

const Sidebar: FC = () => {
  const router = useRouter();

  const { data: groups, isLoading } = useQuery<IGroup[], Error>(
    ['groups'],
    getGroups
  );

  const { width } = useWindowDimensions();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Sidebar is open if window width > 768px, tailwind ´md´
  useEffect(() => {
    if (width > SCREEN_SIZE_MD) setSidebar(true);
  }, [width]);

  const wrapper = useRef<HTMLDivElement>(null);
  //handle outside click in small device
  const checkOutsideClick = useCallback(
    (event) => {
      if (
        sidebar &&
        wrapper.current &&
        !wrapper.current.contains(event.target) &&
        width <= SCREEN_SIZE_MD
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

  // Click handle for sidebar elements
  const onClickSidebarCollection = (id: string) => {
    router.push('/collections/' + id);
    if (width <= SCREEN_SIZE_MD) setSidebar(false);
  };

  const onClickSiderLink = (url: string) => {
    router.push(url);
    if (width <= SCREEN_SIZE_MD) setSidebar(false);
  };

  //Modals
  const createCollectionModal = useModal();
  const createGroupModal = useModal();
  const searchModal = useModal();

  //Feedbacks
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  return (
    <>
      <div
        ref={wrapper}
        className={`${sidebar ? 'w-3/4 sm:w-60' : 'w-0'} transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white flex flex-col py-1.5  space-y-1 `}>
        {/* Top section aka search  */}
        <div className=' flex justify-between items-center space-x-1 px-2'>
          <button
            onClick={searchModal.openModal}
            className='w-full space-x-2 flex items-center rounded p-1
             bg-gray-300 dark:bg-gray-700'>
            <SearchIcon className='icon-sm' />
            <span>Find, explore</span>
          </button>
          <SidebarUserPopoverMenu />
        </div>

        <SidebarBtn
          icon={<TemplateIcon />}
          text='Templates'
          active={router.pathname === '/templates'}
          onClick={() => onClickSiderLink('/templates')}
        />

        <SidebarBtn
          icon={<CollectionIcon />}
          text='My Collections'
          active={router.pathname === '/collections'}
          onClick={() => onClickSiderLink('/collections')}
        />

        {/* Display groups */}
        <div
          className='grow space-y-2 pl-2 pr-2.5 py-2 overflow-y-auto 
        scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
          {isLoading && (
            <div
              className='flex flex-col space-y-1 animate-pulse rounded
             bg-gray-100 dark:bg-gray-800'>
              <div className='w-full h-8  rounded-md bg-gray-300 dark:bg-gray-600'></div>
              <div className='w-1/3 h-4  rounded-md bg-gray-300 dark:bg-gray-600'></div>
            </div>
          )}

          {/* Loading state is finished  */}
          {!isLoading &&
            groups &&
            groups.map((group, idx) => (
              <SidebarGroup key={idx} group={group}>
                {/**Display group collections */}
                {group.collections.map(
                  (collectionId) =>
                    group._id && (
                      <SidebarCollection
                        key={collectionId}
                        collectionId={collectionId}
                        groupId={group._id}
                        onClick={() => onClickSidebarCollection(collectionId)}
                      />
                    )
                )}
              </SidebarGroup>
            ))}
        </div>

        {/* Bottom section  */}
        <div className='w-full px-1 grid grid-cols-6 gap-2'>
          <ThemeBtn />
          <div className='col-span-5 flex border-l-2 pl-2 border-gray-200 dark:border-gray-700'>
            <button
              onClick={createCollectionModal.openModal}
              disabled={groups?.length === 0}
              className='w-full space-x-1 btn btn-secondary 
              disabled:cursor-no-drop disabled:invisible'>
              <span className='icon-sm'>
                <PlusIcon />
              </span>
              <span>New Collection</span>
            </button>
            <ActionIcon onClick={() => createGroupModal.openModal()}>
              <ViewGridAddIcon />
            </ActionIcon>
          </div>
        </div>
      </div>
      <Toaster />
      {groups && createCollectionModal.isOpen && (
        <CreateCollectionModal
          open={createCollectionModal.isOpen}
          handleClose={createCollectionModal.closeModal}
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
      {searchModal.isOpen && (
        <SearchModal
          open={searchModal.isOpen}
          handleClose={searchModal.closeModal}
          onEnter={() => console.log('fn')}
        />
      )}
    </>
  );
};

export default Sidebar;
