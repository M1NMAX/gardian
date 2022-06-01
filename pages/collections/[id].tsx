import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useQuery } from 'react-query';
import { ICollection, IItem } from '../../interfaces';
import Collection from '../../components/Collection';
import { getItem } from '../../fetch/item';
import Drawer from '../../components/Frontstate/Drawer';
import ItemOverview from '../../components/ItemOverview';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import useModal from '../../hooks/useModal';
import toast from 'react-hot-toast';
import NewItemModal from '../../components/Collection/components/NewItemModal';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const { id } = router.query;
  const sidebar = useRecoilValue(sidebarState);

  const { data: collection, refetch } = useQuery<ICollection>(
    'collection',
    async (): Promise<ICollection> => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/collections/' + id
      );
      const response = await res.json();
      return response.data;
    }
  );

  useEffect(() => {
    refetch();
  }, [id]);

  // handle info for Drower
  const [currentItemId, setCurrentItemId] = useState<Number>();
  const [currentItem, setCurrentItem] = useState<IItem>();

  useEffect(() => {
    const fetchItem = async () => {
      if (!currentItemId) return;
      const res = await getItem(currentItemId.valueOf());
      setCurrentItem(res);
    };
    fetchItem();
  }, [collection, currentItemId]);

  const [showDetails, setShowDetails] = useState(false);
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  const handleOnClickItem = (id: Number) => {
    setCurrentItemId(id.valueOf());
    openDetails();
  };

  //New item Modal
  const newItemModal = useModal();
  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  return (
    <>
      <Head>
        <title> {collection ? collection.name : 'Loading...'}</title>
      </Head>
      <Sidebar />
      <main
        className={`${
          sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'
        } flex h-screen space-x-2 dark:bg-gray-900 dark:text-white`}>
        <div className={`${showDetails ? 'w-2/3' : 'w-full'} py-2 px-4`}>
          {collection && (
            <Collection>
              <Collection.Header collection={collection}>
                <h1 className='font-medium text-3xl'>{collection.name}</h1>
              </Collection.Header>
              <Collection.Description>
                {collection.description}
              </Collection.Description>
              <Collection.Body>
                <div>
                  {' '}
                  <button
                    onClick={newItemModal.openModal}
                    className='btn btn-primary'>
                    <span className='icon-sm'>
                      <PlusIcon />
                    </span>
                    <span>New</span>
                  </button>
                </div>
                <div className=' space-y-2'>
                  {collection.items &&
                    collection.items.map((item) => (
                      <>
                        {!(item instanceof Number) && (
                          <ItemOverview
                            item={item}
                            onItemClick={handleOnClickItem}
                          />
                        )}
                      </>
                    ))}
                </div>
              </Collection.Body>
            </Collection>
          )}
        </div>

        {currentItem && (
          <Drawer opened={showDetails} onClose={closeDetails}>
            <Drawer.Title>{currentItem.name}</Drawer.Title>
            <Drawer.Body>
              <div className='space-y-2'>
                {currentItem.properties.map((property) => (
                  <div className='p-1 rounded border'>
                    <p>{property.name}</p>
                    <p>{property.value}</p>
                  </div>
                ))}
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <div className='flex items-center space-x-2'>
                <div className='font-light'>
                  Created{' '}
                  {currentItem.updatedAt
                    ? new Date(currentItem.updatedAt).toDateString()
                    : 'Loading'}
                </div>
                <ActionIcon icon={<TrashIcon />} variant='filled' />
              </div>
            </Drawer.Footer>
          </Drawer>
        )}
      </main>

      {/* New item modal  */}
      {collection && newItemModal.isOpen && (
        <NewItemModal
          open={newItemModal.isOpen}
          handleClose={newItemModal.closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
          collection={collection}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    // access the user session
    const session = getSession(ctx.req, ctx.res);
    console.log(session);
    return { props: { customProp: 'bar' } };
  },
});
