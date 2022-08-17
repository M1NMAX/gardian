import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';
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
      <div className='relative mt-1 flex items-center space-x-1.5'>
        <Listbox.Label className='font-medium'>Sort by</Listbox.Label>
        <Listbox.Button
          className='relative w-52 cursor-default rounded bg-gray-100 dark:bg-gray-700 
  py-2 pl-3 pr-10 text-left shadow-md focus:outline-none 
  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white 
  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 
  focus-visible:ring-offset-orange-300 sm:text-sm'>
          <span className='block truncate'>{value.name}</span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <SelectorIcon
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <Listbox.Options
            className='absolute top-10 right-0  max-h-60 w-52 overflow-auto rounded 
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
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}>
                      {option.name}
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
