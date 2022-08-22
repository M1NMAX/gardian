import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon, LightningBoltIcon } from '@heroicons/react/outline';
import React, { FC, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { deleteGroup, renameGroup } from '../../../services/group';
import useModal from '../../../hooks/useModal';
import { IGroup } from '../../../interfaces';
import DeleteModal from '../../DeleteModal';
import RenameModal from '../../RenameModal';
import SidebarGroupMenu from '../SidebarGroupMenu';

interface SidebarGroupProps {
  children: ReactNode;
  group: IGroup;
}

const SidebarGroup: FC<SidebarGroupProps> = (props) => {
  const { children, group } = props;
  const { _id: id, name } = group;

  //Feedbacks
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  //Modals
  const renameGroupModal = useModal();
  const deleteGroupModal = useModal();

  const queryClient = useQueryClient();

  //handle rename Group and its mutation
  const renameGroupMutation = useMutation(
    async (name: string) => {
      if (!id) return;
      await renameGroup(id, name);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groups']);

        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        renameGroupModal.closeModal();
      },
    }
  );

  //handle delete group and its mutation
  const deleteGroupMutation = useMutation(
    async () => {
      if (!id) return;
      await deleteGroup(id);
    },
    {
      onSuccess: () => {
        positiveFeedback('Success');
        queryClient.invalidateQueries(['groups']);
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        deleteGroupModal.closeModal();
      },
    }
  );

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
          onRename={renameGroupMutation.mutate}
        />
      )}

      {deleteGroupModal.isOpen && (
        <DeleteModal
          open={deleteGroupModal.isOpen}
          handleClose={deleteGroupModal.closeModal}
          name={name}
          onDelete={deleteGroupMutation.mutate}
        />
      )}
    </>
  );
};

export default SidebarGroup;
