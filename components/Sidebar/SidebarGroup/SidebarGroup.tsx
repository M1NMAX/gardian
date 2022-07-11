import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import React, { FC, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { renameGroup } from '../../../fetch/group';
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
      const res = await renameGroup(id, name);
      console.log(res);
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

  return (
    <>
      <Disclosure
        defaultOpen
        as='div'
        className='rounded bg-gray-200  dark:bg-gray-700 mt-2'>
        {({ open }) => (
          <>
            <div className='flex items-center justify-between py-0.5 pr-2'>
              <Disclosure.Button className='flex items-center w-full p-0.5'>
                <ChevronRightIcon
                  className={`${open ? 'rotate-90 transform' : ''} icon-xs`}
                />
                <span> {name}</span>
              </Disclosure.Button>
              {/* Only show delete btn if group empty */}
              <SidebarGroupMenu
                showDelete={group.collections.length === 0}
                onClickRename={renameGroupModal.openModal}
                onClickDelete={deleteGroupModal.openModal}
              />
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

      {/* {deleteGroupModal.isOpen && (
        <DeleteModal
          open={deleteGroupModal.isOpen}
          handleClose={deleteGroupModal.closeModal}
          name={name}
          onDelete={deleteCollectionMutation.mutate}
        />
      )} */}
    </>
  );
};

export default SidebarGroup;
