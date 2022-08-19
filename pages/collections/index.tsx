import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getCollections } from '../../fetch/collections';
import CollectionOverview from '../../components/CollectionOverview/CollectionOverview';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { CubeTransparentIcon, PlusIcon } from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import CreateCollectionModal from '../../components/CreateCollectionModal';
import { ICollection, IGroup } from '../../interfaces';
import { getGroups } from '../../fetch/group';
import useModal from '../../hooks/useModal';
import ViewRadioGroup from '../../components/ViewRadioGroup';
import Group from '../../backend/models/Group';
import dbConnect from '../../backend/database/dbConnect';
import useLocalStorage from '../../hooks/useLocalStorage';
import Header from '../../components/Header';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const { data: groups } = useQuery<IGroup[]>(['groups'], getGroups);

  const { data: collections, isLoading } = useQuery<ICollection[], Error>(
    ['collections'],
    getCollections
  );

  const getCollectionGroupName = (id?: string) => {
    if (!id) return '';
    if (!groups || !collections) return '';
    const group = groups.find((group) => group.collections.includes(id));
    if (!group) return '';
    return group.name;
  };

  //Modal: create collection
  const createCollectionModal = useModal();

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  const [selectedView, setSelectedView] = useLocalStorage<string>(
    'myCollectionView',
    'grid'
  );

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Sidebar />
      <main
        className={`${
          sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'
        } main-content  flex flex-col space-y-2 -z-10`}>
        {/* Header  */}
        <Header
          title='My Collections'
          sidebar={sidebar}
          onClickMenuBtn={() => setSidebar(true)}
        />

        {/* Is loading  */}
        {isLoading && (
          <div className='col-span-full flex flex-col justify-center items-center space-y-4 px-4 h-32'>
            <CubeTransparentIcon className='animate-ping icon-md lg:icon-xl text-primary-200' />
            <span className='font-medium'> Loading ...</span>
          </div>
        )}

        {/* loading state is finish and there are no collection  */}
        {!isLoading && collections && collections.length === 0 && (
          <div className='flex justify-between items-center space-y-4 px-4'>
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
          <div
            className='space-y-1.5 grow px-4 pb-2 overflow-y-scroll scrollbar-thin
             scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scroll-smooth'>
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
              }  `}>
              {collections &&
                collections.map((collection, idx) => (
                  <CollectionOverview
                    key={idx}
                    collection={collection}
                    groupName={getCollectionGroupName(collection._id)}
                  />
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
  returnTo: '/collections',
  async getServerSideProps(ctx) {
    const session = getSession(ctx.req, ctx.res);

    if (session) {
      const user = session.user;

      try {
        // connect to db
        await dbConnect();

        // fecth db for group
        const groups = await Group.find({ userId: user.sub });

        //create group if there is no
        if (groups.length === 0) {
          await Group.create({
            name: 'My Group',
            userId: user.sub,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    return { props: {} as never };
  },
});
