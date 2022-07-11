import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import React, { FC, ReactNode } from 'react';
import { IGroup } from '../../../interfaces';
import SidebarGroupMenu from '../SidebarGroupMenu';

interface SidebarGroupProps {
  children: ReactNode;
  group: IGroup;
}

const SidebarGroup: FC<SidebarGroupProps> = (props) => {
  const { children, group } = props;
  const { _id: id, name } = group;
  return (
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
            <SidebarGroupMenu
              onClickRename={() => console.log('fanf')}
              onClickDelete={() => console.log('fanf')}
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
  );
};

export default SidebarGroup;
