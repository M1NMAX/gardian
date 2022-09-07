import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { sidebarState } from '@atoms/sidebarAtom';
import { SCREEN_SIZE_MD } from '@constants';
import {
  CreateCollectionModal,
  SidebarCollection
} from '@features/collections';
import { CreateGroupModal, SidebarGroup } from '@features/groups';
import { getGroups } from '@features/groups/services';
import { ThemeBtn } from '@features/theme';
import { ActionIcon, Button } from '@frontstate-ui';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline';
import useModal from '@hooks/useModal';
import useWindowDimensions from '@hooks/useWindowDimensions';
import SearchModal from '../SearchModal';
import SidebarBtn from './SidebarBtn';
import SidebarUserPopoverMenu from './SidebarUserPopoverMenu';


const Sidebar: FC = () => {
  const router = useRouter();

  const { data: groups, isLoading } = useQuery(['groups'], getGroups);

  const { width } = useWindowDimensions();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Sidebar is open if window width > 768px, tailwind ´md´
  useEffect(() => {
    if (width > SCREEN_SIZE_MD) setSidebar(true);
  }, [width]);

  // Click handle for sidebar elements
  const onClickSidebarCollection = (id: string) => {
    if (sidebar && width <= SCREEN_SIZE_MD) setSidebar(false);
    router.push('/collections/' + id);
  };

  const onClickSiderLink = (url: string) => {
    if (sidebar && width <= SCREEN_SIZE_MD) setSidebar(false);
    router.push(url);
  };

  //Modals
  const createCollectionModal = useModal();
  const createGroupModal = useModal();
  const searchModal = useModal();

  //Feedbacks
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  return (
    <>
      <div
        className={`${sidebar ? 'w-full sm:w-60' : 'w-0'} transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white flex flex-col py-1.5  space-y-1 `}>
        {/* Top section aka search  */}
        <div className=' flex justify-between items-center space-x-1 px-2'>
          <button
            onClick={searchModal.openModal}
            className='w-full space-x-2 flex items-center rounded p-1
             bg-gray-300 dark:bg-gray-700'>
            <MagnifyingGlassIcon className='icon-sm' />
            <span>Find, explore</span>
          </button>
          <SidebarUserPopoverMenu />
        </div>

        <SidebarBtn
          icon={<RectangleGroupIcon />}
          text='Templates'
          active={router.pathname === '/templates'}
          onClick={() => onClickSiderLink('/templates')}
        />

        <SidebarBtn
          icon={<RectangleStackIcon />}
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
              <div className='w-full h-4  rounded-md bg-gray-300 dark:bg-gray-600'></div>
            </div>
          )}

          {/* Loading state is finished  */}
          {!isLoading &&
            groups &&
            groups.map((group) => (
              <SidebarGroup key={group.id} group={group}>
                {group.collections.map(({ id: cid }) => (
                  <SidebarCollection
                    key={cid}
                    collectionId={cid}
                    groupId={group.id}
                    onClick={() => onClickSidebarCollection(cid)}
                  />
                ))}
              </SidebarGroup>
            ))}
        </div>

        {/* Bottom section  */}
        <div className='w-full flex items-center px-1 space-x-2'>
          <ThemeBtn />
          <div className='grow flex border-l-2 pl-2 border-gray-200 dark:border-gray-700'>
            <Button
              onClick={createCollectionModal.openModal}
              variant='secondary-hover'
              isDisabled={groups && groups.length === 0}
              full>
              <PlusIcon className='icon-sm' />
              <span>New Collection</span>
            </Button>
            <ActionIcon onClick={() => createGroupModal.openModal()}>
              <SquaresPlusIcon className='icon-sm' />
            </ActionIcon>
          </div>
        </div>
      </div>
      <Toaster position='bottom-center' />
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
