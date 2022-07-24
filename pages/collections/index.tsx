import React, { useState } from 'react';
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
  CubeTransparentIcon,
  MenuAlt2Icon,
  PlusIcon,
} from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import CreateCollectionModal from '../../components/CreateCollectionModal';
import { ICollection, IGroup } from '../../interfaces';
import { getGroups } from '../../fetch/group';
import useModal from '../../hooks/useModal';
import ViewRadioGroup from '../../components/ViewRadioGroup';
import { group } from 'console';

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
        <h1 className='font-semibold text-3xl  pl-1 border-l-4 border-primary-100'>
          My Collections
        </h1>

        {/*Filter */}
        <div
          className='flex justify-between items-center py-1 border-dotted 
                border-b-2 border-gray-200 dark:border-gray-700'>
          <ViewRadioGroup value={selectedView} setValue={setSelectedView} />
          <button
            onClick={createCollectionModal.openModal}
            className='btn btn-primary'>
            <span className='icon-sm'>
              <PlusIcon />
            </span>
            <span>New</span>
          </button>
        </div>

        {/* Collections  */}
        <div
          className={`${
            selectedView === 'grid'
              ? 'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full '
              : 'flex flex-col space-y-2'
          }  overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 `}>
          {isLoading ? (
            <div className='col-span-full flex flex-col justify-center items-center space-y-4 h-32'>
              <CubeTransparentIcon className='animate-ping icon-md lg:icon-xl text-primary-200' />
              <span className='font-medium'> Loading ...</span>
            </div>
          ) : (
            collections &&
            collections.map((collection, idx) => (
              <CollectionOverview key={idx} collection={collection} />
            ))
          )}
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
