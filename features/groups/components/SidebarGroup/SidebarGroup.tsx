import React, { FC, ReactNode } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import useModal from '../../../../hooks/useModal';
import DeleteModal from '../../../../components/DeleteModal';
import RenameModal from '../../../../components/RenameModal';
import SidebarGroupMenu from '../SidebarGroupMenu';
import useGroup from '../../hooks/useGroup';
import { GroupWithCollectionsId } from '@features/groups/services';

interface SidebarGroupProps {
  children: ReactNode;
  group: GroupWithCollectionsId;
}

const SidebarGroup: FC<SidebarGroupProps> = (props) => {
  const { children, group } = props;
  const { id, name } = group;

  //Feedbacks
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  //Modals
  const renameGroupModal = useModal();
  const deleteGroupModal = useModal();

  const groupMutations = useGroup(id);

  //handle rename Group and its mutation
  const handleRenameGroup = (name: string) => {
    groupMutations.renameGroupMutateFun(name, {
      onSuccess: () => {
        positiveFeedback('Group renamed');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        renameGroupModal.closeModal();
      },
    });
  };

  //handle delete group and its mutation
  const handleDeleteGroup = () => {
    if (!id) return;
    groupMutations.deleteGroupMutateFun(id, {
      onSuccess: () => {
        positiveFeedback('Group deleted');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        deleteGroupModal.closeModal();
      },
    });
  };

  return (
    <>
      <Disclosure
        defaultOpen
        as='div'
        className='rounded bg-gray-200  dark:bg-gray-700'>
        {({ open }) => (
          <>
            <div className='group flex items-center justify-between py-0.5 pr-2'>
              <Disclosure.Button className='flex items-center space-x-0.5 w-full p-0.5'>
                <ChevronRightIcon
                  className={`${open ? 'rotate-90 transform' : ''} icon-xs`}
                />
                <span> {name}</span>
              </Disclosure.Button>
              {/* Only show delete btn if group empty */}

              <span className='block md:hidden md:group-hover:block md:group-focus-within:block'>
                <SidebarGroupMenu
                  showDelete={group.collections.length === 0}
                  onClickRename={renameGroupModal.openModal}
                  onClickDelete={deleteGroupModal.openModal}
                />
                h
              </span>
            </div>
            {/*Display group collections */}
            {group.collections.length > 0 && (
              <Disclosure.Panel className='py-1 text-sm'>
                {children}
              </Disclosure.Panel>
            )}
          </>
        )}
      </Disclosure>

      {renameGroupModal.isOpen && (
        <RenameModal
          open={renameGroupModal.isOpen}
          handleClose={renameGroupModal.closeModal}
          name={name}
          onRename={handleRenameGroup}
        />
      )}

      {deleteGroupModal.isOpen && (
        <DeleteModal
          open={deleteGroupModal.isOpen}
          handleClose={deleteGroupModal.closeModal}
          onDelete={handleDeleteGroup}>
          <h2>
            Are you sure about delete group{' '}
            <span className='italic'>{name}</span>?
          </h2>
        </DeleteModal>
      )}
    </>
  );
};

export default SidebarGroup;
