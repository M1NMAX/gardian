import React, { Fragment, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getCollections } from '../../fetch/collections';
import CollectionOverview from '../../components/CollectionOverview/CollectionOverview';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import {
  CheckIcon,
  MenuAlt2Icon,
  PlusIcon,
  SelectorIcon,
  ViewGridIcon,
  ViewListIcon,
} from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import CreateCollectionModal from '../../components/CreateCollectionModal';
import { ICollection, IGroup } from '../../interfaces';
import { getGroups } from '../../fetch/group';
import useModal from '../../hooks/useModal';
import { Listbox, RadioGroup, Transition } from '@headlessui/react';

const sortOptions = [
  { name: 'Name Ascending', alias: 'name+asc' },
  { name: 'Name Descending', alias: 'name+des' },
  { name: 'Recently Added', alias: 'createdAt+asc' },
  { name: 'Oldest Added', alias: 'createdAt+des' },
];

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const { data: groups } = useQuery<IGroup[]>('groups', getGroups);

  const { data: collections, isLoading } = useQuery<ICollection[], Error>(
    'collections',
    getCollections
  );

  //Modal: create collection
  const createCollectionModal = useModal();

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  const [selectedView, setSelectedView] = useState('grid');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Sidebar />
      <main
        className={`${
          sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'
        } main-content`}>
        {/* Header  */}
        <div className='flex items-center space-x-2'>
          {!sidebar && (
            <ActionIcon
              icon={<MenuAlt2Icon />}
              onClick={() => setSidebar(true)}
            />
          )}
        </div>

        {/* Title  */}
        <div className='flex items-end justify-between'>
          <h1 className='font-semibold text-3xl  pl-1 border-l-4 border-primary-bright'>
            My Collections
          </h1>
          <button
            onClick={createCollectionModal.openModal}
            className='btn btn-primary'>
            <span className='icon-sm'>
              <PlusIcon />
            </span>
            <span>New</span>
          </button>
        </div>

        {/*Filter */}
        <div className='flex justify-between items-center'>
          <Listbox value={selectedSort} onChange={setSelectedSort}>
            <div className='relative mt-1 flex flex-col'>
              <Listbox.Label className='text-xs'>Sort by</Listbox.Label>
              <Listbox.Button
                className='relative w-52 cursor-default rounded bg-gray-100 dark:bg-gray-700 
              py-2 pl-3 pr-10 text-left shadow-md focus:outline-none 
              focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white 
              focus-visible:ring-opacity-75 focus-visible:ring-offset-2 
              focus-visible:ring-offset-orange-300 sm:text-sm'>
                <span className='block truncate'>{selectedSort.name}</span>
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
                  className='absolute mt-1 max-h-60 w-full overflow-auto rounded 
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
                              <CheckIcon
                                className='icon-sm'
                                aria-hidden='true'
                              />
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
          <RadioGroup
            value={selectedView}
            onChange={(e) => {
              setSelectedView(e);
              close();
            }}>
            <div className='max-w-fit flex space-x-1 rounded p-0.5 bg-gray-50 dark:bg-gray-700'>
              <RadioGroup.Option
                value='grid'
                className={({ checked }) =>
                  `${
                    checked
                      ? 'bg-green-500  text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }
                                 relative rounded shadow-md px-1 cursor-pointer flex focus:outline-none`
                }>
                {({ checked }) => (
                  <RadioGroup.Label
                    as='p'
                    className={`flex items-center space-x-1  font-medium ${
                      checked ? 'text-white' : 'text-black dark:text-gray-50'
                    }`}>
                    <ViewGridIcon className='icon-xs' />
                  </RadioGroup.Label>
                )}
              </RadioGroup.Option>

              <RadioGroup.Option
                value='list'
                className={({ checked }) =>
                  `${
                    checked
                      ? 'bg-green-500  text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }
                                 relative rounded shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
                }>
                {({ checked }) => (
                  <RadioGroup.Label
                    as='p'
                    className={`flex items-center space-x-1 font-medium ${
                      checked ? 'text-white' : 'text-black dark:text-gray-50'
                    }`}>
                    <ViewListIcon className='icon-xs' />
                  </RadioGroup.Label>
                )}
              </RadioGroup.Option>
            </div>
          </RadioGroup>
        </div>

        {/* Collections  */}
        <div
          className={`${
            selectedView === 'grid'
              ? 'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full '
              : 'flex flex-col space-y-2'
          }  overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 `}>
          {isLoading
            ? [0, 1, 2].map((idx) => (
                // show 3 skeleton  if is loading
                <div
                  key={idx}
                  className='flex flex-col space-y-1 p-1  animate-pulse rounded bg-gray-100 dark:bg-gray-800'>
                  <div className='w-1/3 h-4  rounded-md bg-gray-200 dark:bg-gray-500'></div>
                  <div className='w-2/3 h-5 rounded-md bg-gray-200 dark:bg-gray-500'></div>
                  <div className='w-1/12 h-3 rounded-md bg-gray-200 dark:bg-gray-500'></div>
                </div>
              ))
            : collections &&
              collections.map((collection, idx) => (
                <CollectionOverview key={idx} collection={collection} />
              ))}
        </div>

        {!isLoading && collections && collections.length === 0 && (
          <div className='flex justify-center'>
            <p className='text-lg  p-2 rounded-md bg-gray-100 dark:bg-gray-800 '>
              Wow, such empty &#58;&#41;
            </p>
          </div>
        )}
      </main>
      <Toaster />

      {/* New collection modal  */}
      {createCollectionModal.isOpen && groups && (
        <CreateCollectionModal
          open={createCollectionModal.isOpen}
          handleClose={createCollectionModal.closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
          groups={groups}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
