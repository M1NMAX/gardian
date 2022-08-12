import React, { useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
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
import Group from '../../backend/models/Group';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const { data: groups } = useQuery<IGroup[]>(['groups'], getGroups);

  const { data: collections, isLoading } = useQuery<ICollection[], Error>(
    ['collections'],
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

        {/* Is loading  */}
        {isLoading && (
          <div className='col-span-full flex flex-col justify-center items-center space-y-4 h-32'>
            <CubeTransparentIcon className='animate-ping icon-md lg:icon-xl text-primary-200' />
            <span className='font-medium'> Loading ...</span>
          </div>
        )}

        {/* loading state is finish and there are no collection  */}
        {!isLoading && collections && collections.length === 0 && (
          <div
            className='flex justify-between items-center space-y-4 pt-1 
            border-dotted border-t-2 border-gray-200 dark:border-gray-700'>
            {/** add collection btn */}
            <button
              onClick={createCollectionModal.openModal}
              className={`${
                !isLoading &&
                collections &&
                collections.length === 0 &&
                'w-full justify-center'
              } btn btn-primary`}>
              <span className='icon-sm'>
                <PlusIcon />
              </span>
              <span>New Collection</span>
            </button>
          </div>
        )}

        {/* loading state is finished and there are collection */}
        {!isLoading && collections && collections.length > 0 && (
          <div className='space-y-1.5 pt-1 border-dotted border-t-2 border-gray-200 dark:border-gray-700'>
            <div className='flex justify-between items-center'>
              {/** add collection btn */}
              <button
                onClick={createCollectionModal.openModal}
                className='btn btn-primary'>
                <span className='icon-sm'>
                  <PlusIcon />
                </span>
                <span>New Collection</span>
              </button>

              {/* views  */}
              <ViewRadioGroup value={selectedView} setValue={setSelectedView} />
            </div>

            {/* Collections  */}
            <div
              className={`${
                selectedView === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full '
                  : 'flex flex-col space-y-2'
              }  overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 `}>
              {collections &&
                collections.map((collection, idx) => (
                  <CollectionOverview key={idx} collection={collection} />
                ))}
            </div>
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

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/',
  async getServerSideProps(ctx) {
    const session = getSession(ctx.req, ctx.res);
    if (session) {
      const user = session.user;
      // fecth db for group
      const groups = await Group.find({ userId: user.sub });

      //create group if there is no
      if (groups.length === 0) {
        await Group.create({
          name: 'My Group',
          userId: user.sub,
        });
      }
    }

    return { props: {} as never };
  },
});
