import React, { FC, Fragment, ReactNode } from 'react';
import { useQuery } from 'react-query';
import { Popover, Transition } from '@headlessui/react';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { getGroups } from '../../services';


interface GroupPickerPopoverProps {
  children: ReactNode;
  onClickGroup: (gid: string) => void;
}
const GroupPickerPopover: FC<GroupPickerPopoverProps> = (props) => {
  const { children, onClickGroup } = props;
  const { data: groups } = useQuery(['popoverGroups'], getGroups);

  return (
    <Popover className='relative'>
      <Popover.Button className='w-full'>{children}</Popover.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'>
        <Popover.Panel
          className='absolute left-1/2 bottom-full z-10 mb-2 px-4 sm:px-0
            w-screen max-w-sm lg:max-w-xs -translate-x-1/2 transform '>
          {({ close }) => (
            <div
              className='flex flex-col p-1 space-y-1
              rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden'>
              <span className='text-center text-lg'>Location</span>
              {groups &&
                groups.map(({ id, name, collections }) => (
                  <button
                    key={id}
                    onClick={() => {
                      onClickGroup(id);
                      close();
                    }}
                    className='flex items-center justify-between py-1 px-2 
                   rounded bg-gray-100 hover:bg-gray-50
                     dark:bg-gray-700 dark:hover:bg-gray-600'>
                    <span className='truncate font-semibold'>{name}</span>
                    <span className='flex items-center space-x-0.5'>
                      <HashtagIcon className='icon-xxs' />
                      <span>{collections.length}</span>
                    </span>
                  </button>
                ))}
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default GroupPickerPopover;
