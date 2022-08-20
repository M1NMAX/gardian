import { Listbox, Transition } from '@headlessui/react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  SelectorIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/outline';
import React, { Dispatch, FC, Fragment } from 'react';
import { SortOption } from '../../interfaces';

interface SortOptionsListboxProps {
  sortOptions: SortOption[];
  value: SortOption;
  setValue: Dispatch<React.SetStateAction<SortOption>>;
}

const SortOptionsListbox: FC<SortOptionsListboxProps> = (props) => {
  const { sortOptions, value, setValue } = props;
  return (
    <Listbox value={value} onChange={setValue}>
      <div className='relative '>
        <Listbox.Button
          className='relative max-w-fit flex items-center space-x-1 p-1  
          cursor-default rounded bg-gray-100 dark:bg-gray-700 text-left shadow-md '>
          <span className='block truncate'>{value.name}</span>
          {value.alias.split('+')[1] === 'asc' ? (
            <ArrowUpIcon className='icon-xxs' />
          ) : (
            <ArrowDownIcon className='icon-xxs' />
          )}
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
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}>
                        {option.name}
                      </span>
                      {option.alias.split('+')[1] === 'asc' ? (
                        <SortAscendingIcon className='icon-xs' />
                      ) : (
                        <SortDescendingIcon className='icon-xs' />
                      )}
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
