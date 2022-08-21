import React, { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
} from '@heroicons/react/outline';

import { OrderType, SortOptionType } from '../../utils/sort';

interface SortOptionsListboxProps {
  sortOptions: SortOptionType[];
  selectedOption: SortOptionType;
  onChangeOption: (option: SortOptionType) => void;
}

const SortIcon = ({ order }: { order: OrderType }) =>
  order === 'asc' ? (
    <ArrowUpIcon className='icon-xxs' />
  ) : (
    <ArrowDownIcon className='icon-xxs' />
  );

const SortOptionsListbox: FC<SortOptionsListboxProps> = (props) => {
  const { sortOptions, selectedOption, onChangeOption } = props;
  return (
    <Listbox value={selectedOption} onChange={onChangeOption}>
      <div className='relative '>
        <Listbox.Button
          className='relative max-w-fit flex items-center space-x-1 p-1  
          cursor-default rounded bg-gray-100 dark:bg-gray-700 text-left shadow-md '>
          <span className='block truncate first-letter:uppercase'>
            {selectedOption.field}
          </span>
          <SortIcon order={selectedOption.order} />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <Listbox.Options
            className='absolute top-10 right-0  max-h-60 max-w-fit overflow-auto rounded 
      bg-gray-200 dark:bg-gray-700  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 
    focus:outline-none sm:text-sm'>
            {sortOptions.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-900 dark:text-white'
                  }`
                }
                value={option}>
                {({ selected }) => (
                  <>
                    <span className='flex items-center space-x-1'>
                      <span
                        className={`block truncate first-letter:uppercase ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}>
                        {option.field}
                      </span>
                      <SortIcon order={option.order} />
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-green-500'>
                        <CheckIcon className='icon-sm' aria-hidden='true' />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default SortOptionsListbox;
