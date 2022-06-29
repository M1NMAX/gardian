import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query';
import { ICollection, IItem, IItemProperty, IProperty } from '../../interfaces';
import Collection from '../../components/Collection';
import {
  addPropertyToItem,
  deleteItem,
  getItem,
  removePropertyFromItem,
  updateItemProperty,
} from '../../fetch/item';
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
import NewItemModal from '../../components/NewItemModal';
import {
  addPropertyToCollection,
  removePropertyFromCollection,
  removeItemFromCollection,
  updateCollectionProperty,
  getCollection,
} from '../../fetch/collections';
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

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  //Modals
  const newItemModal = useModal();
  const deleteModal = useModal();

  //Query and cache
  const queryClient = useQueryClient();
  //Fetch collection and its items
  const { data: collection, refetch } = useQuery<ICollection>(
    ['collection', id],
    () => getCollection(!id || Array.isArray(id) ? '22' : id)
  );

  const collectionId = collection?._id;
  //Fetch collection items
  const itemsQueries = useQueries(
    !collection
      ? []
      : collection.items.map((item) => {
          return {
            queryKey: ['items', collectionId, item],
            queryFn: () => getItem(item),
            enabled: !!collectionId,
          };
        })
  );

  useEffect(() => {
    refetch();
    closeDetails();
  }, [id]);

  //Mutations

  //Handle delete item mutation
  const updateItemPropertyMutation = useMutation(updateItemProperty, {
    onSuccess: async () => {
      if (!collectionId) throw 'CollectionId is undefined';
      if (!selectedItemId) throw 'CurrentItemId is undefined';

      queryClient.invalidateQueries(['items', collectionId, selectedItemId]);
    },
    onError: () => {
      negativeFeedback();
    },
  });
  //Handle delete item mutation
  const deleteItemMutation = useMutation(deleteItem, {
    onSuccess: async () => {
      if (!collectionId) throw 'CollectionId is undefined';
      if (!selectedItemId) throw 'CurrentItemId is undefined';

      await removeItemFromCollection(collectionId, selectedItemId);

      queryClient.invalidateQueries(['collection', collectionId]);
      queryClient.removeQueries(['items', collectionId, selectedItemId]);

      positiveFeedback('Item deleted');
      closeDetails();
    },
    onError: () => {
      negativeFeedback();
    },
    onSettled: () => {
      deleteModal.closeModal();
    },
  });

  //handle add collection property mutation
  const addCollectioPropertyMutation = useMutation(addPropertyToCollection, {
    onSuccess: (data) => {
      if (!collectionId) throw 'CollectionId is undefined';

      //adds Property to all items of collection
      addPorpertyToAllItem(data);

      queryClient.invalidateQueries(['collection', collectionId]);
      queryClient.invalidateQueries(['items', collectionId]);
    },
    onError: () => {
      negativeFeedback();
    },
  });

  //handle update collection property mutation
  const updateCollectioPropertyMutation = useMutation(
    updateCollectionProperty,
    {
      onSuccess: ({ propertyId }) => {
        if (!collectionId) throw 'CollectionId is undefined';

        queryClient.invalidateQueries(['collection', collectionId]);
        queryClient.invalidateQueries(['items', collectionId]);

        positiveFeedback('Property updated');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  //handle delete collection property mutation
  const deleteCollectioPropertyMutation = useMutation(
    removePropertyFromCollection,
    {
      onSuccess: async ({ propertyId }) => {
        if (!collectionId) throw 'CollectionId is undefined';

        // remove property form all collection's item
        collection.items.map((itemId) =>
          removePropertyFromItem(itemId, propertyId)
        );

        queryClient.invalidateQueries(['collection', collectionId]);
        queryClient.invalidateQueries(['items', collectionId]);

        positiveFeedback('Property removed');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  // handle Drawer
  const [showDetails, setShowDetails] = useState(false);
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  const handleOnClickItem = (id: number) => {
    setSelectedItemId(id);
    openDetails();
  };

  //Handle selected item
  const [selectedItemId, setSelectedItemId] = useState<number>();
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [selectedItemUpdateTs, setSelectedItemUpdateTs] = useState<Date>();
  const [selectedItemPorperties, setSelectedItemPorperties] = useState<
    IItemProperty[]
  >([]);

  useEffect(() => {
    const fetchItem = async () => {
      if (!selectedItemId) return;
      const item = await getItem(selectedItemId);
      setSelectedItemName(item.name);
      setSelectedItemUpdateTs(item.updatedAt);
      setSelectedItemPorperties(item.properties);
    };
    fetchItem();
  }, [collection, selectedItemId]);

  const getCollectionPropertyById = (id: number) => {
    if (!id || !collection) return {} as IProperty;

    const property = collection.properties.find(
      (property) => property._id === id
    );

    return property || ({} as IProperty);
  };

  const setPropertyValue = (id: number, value: string): void => {
    if (!id || !selectedItemId) return;
    //TODO:Do some mutation for certain property type
    setSelectedItemPorperties(
      selectedItemPorperties.map((property) =>
        property._id == id ? { ...property, value } : property
      )
    );
    updateItemPropertyMutation.mutate({
      itemId: selectedItemId,
      propertyId: id,
      property: { _id: id, value },
    });
  };

  const getPropertyValue = (id: number): string => {
    if (!id) return '';
    const property = selectedItemPorperties.find(
      (property) => property._id === id
    );
    if (!property) return '';
    return property.value;
  };

  //Util function that add the lastest collection property
  //to all collection's items
  const addPorpertyToAllItem = (collection: ICollection) => {
    //get id of the lastest collection's property
    const { _id } = collection.properties[collection.properties.length - 1];

    collection.items.map((itemId) => {
      addPropertyToItem(itemId, { _id, value: '' });
    });
  };

  //handles that make user of mutations above
  const handleOnClickAddProperty = async () => {
    if (!collection || !collection._id) return;
    addCollectioPropertyMutation.mutate({
      collectionId: collection._id,
      property: {
        name: 'Property',
        type: 'text',
        values: [''],
        color: '#991b1b',
      },
    });
  };

  const handleDuplicateProperty = async (property: IProperty) => {
    if (!collection || !collection._id) return;
    addCollectioPropertyMutation.mutate({
      collectionId: collection._id,
      property,
    });
  };

  const handleUpdateProperty = async (property: IProperty) => {
    if (!property._id) return;
    if (!collectionId) return;
    updateCollectioPropertyMutation.mutate({
      collectionId,
      propertyId: property._id,
      property,
    });
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!collection || !collectionId) return;
    deleteCollectioPropertyMutation.mutate({ collectionId, propertyId });
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
              <Collection.Header
                collection={collection}
                openNewItemModal={newItemModal.openModal}>
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
                  {itemsQueries.map(
                    ({ data: item }) =>
                      item && (
                        <ItemOverview
                          key={item._id}
                          item={item}
                          collectionProperty={collection.properties}
                          onItemClick={handleOnClickItem}
                        />
                      )
                  )}
                </div>
              </Collection.Body>
            </Collection>
          )}
        </div>

        {selectedItemId && (
          <Drawer opened={showDetails} onClose={closeDetails}>
            <Drawer.Title>{selectedItemName}</Drawer.Title>
            <Drawer.Body>
              <div className='space-y-2'>
                {selectedItemPorperties.map(
                  (property) =>
                    property._id && (
                      <Property
                        itemProperty={property}
                        collectionProperty={getCollectionPropertyById(
                          property._id
                        )}
                        getValue={getPropertyValue}
                        setValue={setPropertyValue}
                        onPropertyUpdate={handleUpdateProperty}
                        onPropertyDuplicate={handleDuplicateProperty}
                        onPropertyDelete={handleDeleteProperty}
                      />
                    )
                )}

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
                  Last update{' '}
                  {selectedItemUpdateTs
                    ? new Date(selectedItemUpdateTs).toDateString()
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
      {selectedItemId && deleteModal.isOpen && (
        <DeleteModal
          name={selectedItemName}
          open={deleteModal.isOpen}
          handleClose={deleteModal.closeModal}
          onDelete={() => deleteItemMutation.mutate(selectedItemId || -1)}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
