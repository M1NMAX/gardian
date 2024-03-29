import { Button, DarkThemeToggle, Tooltip } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useSidebarContext } from '@context/SidebarContext';
import { CreateCollectionModal, SidebarCollection } from '@features/collections';
import { CreateGroupModal, getGroups, SidebarGroup } from '@features/groups';
import {
  PlusIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline';
import useModal from '@hooks/useModal';
import { useQuery } from '@tanstack/react-query';
import SidebarBtn from './SidebarBtn';
import SidebarUserPopoverMenu from './SidebarUserPopoverMenu';


const Sidebar: FC = () => {
  const router = useRouter();

  const sidebar = useSidebarContext();

  const { data: groups, isLoading } = useQuery(['groups'], getGroups);

  // Click handle for sidebar elements
  const onClickSidebarCollection = (id: string) => {
    if (sidebar.isOpenOnSmallScreens) sidebar.setOpenOnSmallScreens(false);
    router.push('/collections/' + id);
  };

  const onClickSiderLink = (url: string) => {
    // if (sidebar.isOpenOnSmallScreens) sidebar.setOpenOnSmallScreens(false);
    router.push(url);
  };

  //Modals
  const createCollectionModal = useModal();
  const createGroupModal = useModal();

  //Feedbacks
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  return (
    <>
      <aside
        className={`${
          sidebar.isOpenOnSmallScreens ? 'w-full sm:w-72' : 'w-0'
        } transition-all duration-200 ease-linear  h-full  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white flex flex-col py-1.5  space-y-1 `}>
        {/* Top section aka search  */}
        <div className='flex justify-between items-center space-x-1 px-1'>
          <SidebarUserPopoverMenu />
          <Tooltip content='Theme'>
            <DarkThemeToggle />
          </Tooltip>
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
                {group.collections.map(({ id: cid }: { id: string }) => (
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
        <div className='w-full flex justify-between items-center space-x-1 px-1'>
          <Button
            color='secondary'
            onClick={createCollectionModal.openModal}
            disabled={groups && groups.length === 0}>
            <PlusIcon className='icon-sm' />
            <span>New Collection</span>
          </Button>

          <Tooltip content='Create Group'>
            <Button color='gray' onClick={() => createGroupModal.openModal()}>
              <SquaresPlusIcon className='icon-sm' />
            </Button>
          </Tooltip>
        </div>
        <Toaster position='bottom-center' />
      </aside>
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
    </>
  );
};

export default Sidebar;
