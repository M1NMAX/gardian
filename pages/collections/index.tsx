import React, { useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getUserCollections } from '../../fetch/collections';
import CollectionOverview from '../../components/CollectionOverview/CollectionOverview';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import NewCollectionModal from '../../components/NewCollectionModal';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //TODO: Add loading and error

  //Modal: create collection
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

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
          <div className='flex items-center space-x-2'>
            {!sidebar && (
              <ActionIcon
                icon={<MenuAlt2Icon />}
                variant='secondary'
                onClick={() => setSidebar(true)}
              />
            )}
            <h1 className='font-semibold text-xl'>Collections </h1>
          </div>
          <button onClick={openModal} className='btn btn-primary'>
            New
          </button>
        </div>

        <div
          className='grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-2 max-h-full
                overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
          {[1, 2, 3, 4].map((collection, idx: number) => (
            <div>{collection}</div>
          ))}
        </div>
      </main>
      <Toaster />
      {open && (
        <NewCollectionModal
          open={open}
          isSub={false}
          collectionId={null}
          parentName=''
          handleClose={closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
