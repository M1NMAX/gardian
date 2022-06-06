import { DuplicateIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';

const propertyTypes = [
  'text',
  'select',
  'checkbox',
  'url',
  'date',
  'number',
  'multi-select',
  'file',
];

const EditPropertyPopover = () => {
  return (
    <Popover className='relative'>
      <Popover.Button className='btn btn-primary'>
        <PlusIcon className='icon-sm' />
        <span>Add property</span>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
        afterEnter={() => console.log('bvbuia')}>
        <Popover.Panel className='absolute top-0 left-1/2 z-10 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0 '>
          <div className='overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y dark:divide-emerald-500'>
            <div className='relative  bg-white dark:bg-gray-900 p-2'>
              <label>
                <span className='modal-input-label'>Name</span>
                <input
                  type='text'
                  name='name'
                  placeholder='Property name'
                  className='modal-input'
                />
              </label>
              <label>
                <span className='modal-input-label'>Property type</span>
                <select className='modal-input'>
                  {propertyTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='flex flex-col p-1 bg-gray-200  dark:bg-gray-800'>
              <button className='collection-menu-item-btn'>
                <DuplicateIcon className='icon-sm' />
                <span>Duplicate property</span>
              </button>
              <button className='collection-menu-item-btn'>
                <TrashIcon className='icon-sm' />
                <span>Delete property</span>
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default EditPropertyPopover;
