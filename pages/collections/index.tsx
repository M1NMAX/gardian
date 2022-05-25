import React from 'react';
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
  AdjustmentsIcon,
  DotsVerticalIcon,
  MenuAlt2Icon,
  PlusIcon,
} from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import NewCollectionModal from '../../components/NewCollectionModal';
import { ICollection, IGroup } from '../../interfaces';
import { getGroups } from '../../fetch/group';
import useModal from '../../hooks/useModal';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const { data: groups } = useQuery<IGroup[]>('groups', getGroups);

  //TODO: Add loading and error feedback
  const { data: collections } = useQuery<ICollection[], Error>(
    'collections',
    getCollections
  );

  //Modal: create collection
  const newCollectionModal = useModal();

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

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
        <div className='flex justify-between items-center'>
          {/* Header  */}
          <div className='flex items-center space-x-2'>
            {!sidebar && (
              <ActionIcon
                icon={<MenuAlt2Icon />}
                onClick={() => setSidebar(true)}
              />
            )}
          </div>
          <div className='flex items-center space-x-1.5'>
            <ActionIcon
              icon={<AdjustmentsIcon className='rotate-90' />}
              variant='filled'
            />
            <ActionIcon icon={<DotsVerticalIcon />} variant='filled' />
          </div>
        </div>
        {/* Title  */}
        <div className='flex items-end justify-between'>
          <h1 className='font-semibold text-3xl '>My Collections</h1>
          <button
            onClick={newCollectionModal.openModal}
            className='btn btn-primary'>
            <span className='icon-sm'>
              <PlusIcon />
            </span>
            <span>New</span>
          </button>
        </div>

        {/* Collections  */}
        <div
          className='grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-2 max-h-full
                overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
          {collections &&
            collections.map((collection, idx) => (
              <CollectionOverview key={idx} collection={collection} />
            ))}
        </div>
      </main>
      <Toaster />

      {/* New collection modal  */}
      {newCollectionModal.isOpen && groups && (
        <NewCollectionModal
          open={newCollectionModal.isOpen}
          handleClose={newCollectionModal.closeModal}
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
