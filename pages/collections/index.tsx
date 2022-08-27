import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getCollections } from '../../services/collections';
import {
  CreateCollectionModal,
  CollectionOverview,
} from '../../features/collections';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import {
  CubeTransparentIcon,
  PlusIcon,
  ViewBoardsIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import { ICollection, IGroup } from '../../interfaces';
import { getGroups } from '../../services/group';
import useModal from '../../hooks/useModal';
import Group from '../../backend/models/Group';
import dbConnect from '../../backend/database/dbConnect';
import useLocalStorage from '../../hooks/useLocalStorage';
import Header from '../../components/Header';
import { useSort, SortOptionsListbox } from '../../features/sort';
import { ActionIcon, Button } from '../../components/frontstate-ui';
import { SORT_ASCENDING, SORT_DESCENDING } from '../../constants';
import { SortOptionType } from '../../types';

const sortOptions: SortOptionType[] = [
  { field: 'name', order: SORT_ASCENDING },
  { field: 'name', order: SORT_DESCENDING },
  { field: 'createdAt', order: SORT_ASCENDING },
  { field: 'createdAt', order: SORT_DESCENDING },
];

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const sidebar = useRecoilValue(sidebarState);

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

  //views
  const [isGridView, setIsGridView] = useLocalStorage<boolean>(
    'myCollectionView',
    false
  );

  //sort
  const {
    selectedSortOption,
    sortedList: sortedCollections,
    onChangeSortOption,
  } = useSort(sortOptions[0], collections || []);

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
        <Header>
          <h1 className='grow font-semibold text-xl md:text-2xl pl-1 border-l-4 border-primary-100'>
            My Collections
          </h1>

          {!isLoading && sortedCollections.length > 0 && (
            <div className='flex items-center space-x-2'>
              <Button
                onClick={createCollectionModal.openModal}
                variant='primary-hover'>
                <PlusIcon className='icon-md md:icon-sm ' />
                <span className='hidden md:block'>New Collection</span>
              </Button>

              {/*SORT */}
              <SortOptionsListbox
                sortOptions={sortOptions}
                selectedOption={selectedSortOption}
                onChangeOption={onChangeSortOption}
              />
              {/* views  */}
              <ActionIcon
                variant='filled'
                onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? (
                  <ViewGridIcon className='icon-sm' />
                ) : (
                  <ViewBoardsIcon className='icon-sm rotate-90' />
                )}
              </ActionIcon>
            </div>
          )}
        </Header>
        <div
          className='space-y-1.5 grow px-4 pb-2 overflow-y-scroll scrollbar-thin
             scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scroll-smooth'>
          {/* Is loading  */}
          {isLoading && (
            <div className='col-span-full flex flex-col justify-center items-center space-y-4 px-4 h-32'>
              <CubeTransparentIcon className='animate-ping icon-md lg:icon-xl text-primary-200' />
              <span className='font-medium'> Loading ...</span>
            </div>
          )}

          {/* loading state is finish and there are no collection  */}
          {!isLoading && sortedCollections.length === 0 && (
            <Button
              onClick={createCollectionModal.openModal}
              variant='primary-filled'
              full>
              <PlusIcon className='icon-sm' />
              <span>New Collection</span>
            </Button>
          )}

          {/* loading state is finished and there are collection */}
          {!isLoading && sortedCollections.length > 0 && (
            <div
              className={`${
                isGridView
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full '
                  : 'flex flex-col space-y-2'
              }  `}>
              {/* Collections  */}
              {sortedCollections &&
                sortedCollections.map((collection, idx) => (
                  <CollectionOverview
                    key={idx}
                    collection={collection}
                    groupName={getCollectionGroupName(collection._id)}
                    isGridView={isGridView}
                  />
                ))}
            </div>
          )}
        </div>
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
