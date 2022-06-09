import React, { Fragment, useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useQuery } from 'react-query';
import { ICollection, IItem, IProperty } from '../../interfaces';
import Collection from '../../components/Collection';
import { deleteItem, getItem } from '../../fetch/item';
import Drawer from '../../components/Frontstate/Drawer';
import ItemOverview from '../../components/ItemOverview';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import {
  PlusIcon,
  TrashIcon,
  ViewGridIcon,
  ViewListIcon,
} from '@heroicons/react/outline';
import useModal from '../../hooks/useModal';
import toast from 'react-hot-toast';
import NewItemModal from '../../components/Collection/components/NewItemModal';
import { addProperty, removeItemFromCollection } from '../../fetch/collections';
import DeleteModal from '../../components/DeleteModal';
import Property from '../../components/Property';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const { id } = router.query;
  const sidebar = useRecoilValue(sidebarState);

  //View mode
  const [isListView, setIsListView] = useState(true);

  //Fetch collection data
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
    closeDetails();
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

  const deleteModal = useModal();

  const handleDeleteItem = async () => {
    if (!collection) return;
    if (!currentItemId || !collection._id) return;

    try {
      const itemId = currentItemId.valueOf();

      await deleteItem(itemId);
      await removeItemFromCollection(collection._id, itemId);
      closeDetails();
      deleteModal.closeModal();
      positiveFeedback('Item deleted');
    } catch (error) {
      negativeFeedback();
    }
  };

  const getCollectionPropertyById = (id?: number) => {
    if (!collection) return;
    if (!collection.template) return;
    const collectionProperties = collection.template.properties;
    const property = collectionProperties.filter(
      (property) => property._id === id
    )[0];
    return property;
  };

  const handleOnClickAddProperty = () => {
    if (!collection) return;
    if (!collection._id || !collection.template) return;
    const newProperty: IProperty = {
      name: 'Property',
      type: 'text',
      values: [''],
      color: '#991b1b',
    };

    // ({id: collectionid}, {$push: {template.$.properties: {newPorperty}}})
    console.log(collection.template);
    console.log('before');
    console.log(collection.template.properties);
    console.log('after');
    const nPA = [...collection.template.properties, newProperty];
    console.log(nPA);
    addProperty(newProperty, collection._id);

    //Add to collection template

    //Add property into all collection item

    console.log(newProperty);
  };

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
                <div
                  className='flex justify-between items-center py-0.5 border-dotted 
                      border-b-2 border-gray-200 dark:border-gray-700'>
                  <ActionIcon
                    icon={isListView ? <ViewGridIcon /> : <ViewListIcon />}
                    onClick={() => setIsListView(!isListView)}
                  />
                  <button
                    onClick={newItemModal.openModal}
                    className='btn btn-primary'>
                    <span className='icon-sm'>
                      <PlusIcon />
                    </span>
                    <span>New</span>
                  </button>
                </div>
                <div className='py-1 space-y-2'>
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
                  <Property
                    itemProperty={property}
                    cProperty={getCollectionPropertyById(property._id)}
                  />
                ))}

                <button
                  onClick={handleOnClickAddProperty}
                  className='btn btn-primary'>
                  <PlusIcon className='icon-sm' />
                  <span>Add property</span>
                </button>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <div className='flex justify-between items-center space-x-2'>
                <div className='font-light'>
                  Created{' '}
                  {currentItem.updatedAt
                    ? new Date(currentItem.updatedAt).toDateString()
                    : 'Loading'}
                </div>
                <ActionIcon
                  icon={<TrashIcon />}
                  variant='filled'
                  onClick={deleteModal.openModal}
                />
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

      {/* Delete item modal  */}
      {currentItem && deleteModal.isOpen && (
        <DeleteModal
          name={currentItem.name}
          open={deleteModal.isOpen}
          handleClose={deleteModal.closeModal}
          onDelete={handleDeleteItem}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
