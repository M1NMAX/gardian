import React from 'react';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { getSession } from '@lib/auth/session';
import Sidebar from '@components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getCollections } from '@features/collections';
import {
  CreateCollectionModal,
  CollectionOverview,
} from '@features/collections';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '@atoms/sidebarAtom';
import {
  CubeTransparentIcon,
  PlusIcon,
  ViewBoardsIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import { getGroup, getGroups } from '@features/groups/services';
import useModal from '@hooks/useModal';
import useLocalStorage from '@hooks/useLocalStorage';
import Header from '@components/Header';
import { useSort, SortOptionsListbox } from '@features/sort';
import { ActionIcon, Button } from '@frontstate-ui';
import { SORT_ASCENDING, SORT_DESCENDING } from '@constants';
import { SortOptionType } from '@types';
import { authOptions } from '@api/auth/[...nextauth]';
import prisma from '@lib/prisma';

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

  const { data: groups } = useQuery(['groups'], getGroups);

  const { data: collections, isLoading } = useQuery(
    ['collections'],
    getCollections
  );

  const getCollectionGroupName = async (gid: string) => {
    const group = await getGroup(gid);
    return group.name;
  };

  //Modal: create collection
  const createCollectionModal = useModal();

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

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
                sortedCollections.map((collection) => (
                  <CollectionOverview
                    key={collection.id}
                    collection={collection}
                    // groupName={getCollectionGroupName(collection.groupId)}
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx.req, ctx.res, authOptions);

  //Redirect user to collections page if user has a valid session
  if (session) {
    const userId = session.user.id;

    try {
      const groups = await prisma.group.findFirst({ where: { userId } });

      if (groups == null) {
        await prisma.group.create({
          data: { name: 'My Group', userId },
        });
      }
    } catch (error) {
      console.log('[page] collections/', error);
    }
  }
  return { props: {} as never };
}
