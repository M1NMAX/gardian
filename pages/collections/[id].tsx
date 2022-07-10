import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query';
import { ICollection, IItemProperty, IProperty } from '../../interfaces';
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
  TableIcon,
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
  updateCollectionDescription,
} from '../../fetch/collections';
import DeleteModal from '../../components/DeleteModal';
import Property from '../../components/Property';
import EditDescriptionModal from '../../components/EditDescriptionModal';
import { RadioGroup } from '@headlessui/react';
import ItemRow from '../../components/ItemRow';
import { DotsVerticalIcon } from '@heroicons/react/solid';

const sortOptions = [
  { name: 'Name Ascending', alias: 'name+asc' },
  { name: 'Name Descending', alias: 'name+des' },
  { name: 'Recently Added', alias: 'createdAt+asc' },
  { name: 'Oldest Added', alias: 'createdAt+des' },
];

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const { id } = router.query;
  const sidebar = useRecoilValue(sidebarState);

  //View mode
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  //Modals
  const newItemModal = useModal();
  const deleteModal = useModal();
  const descriptionModal = useModal();

  //Query and cache
  const queryClient = useQueryClient();
  //Fetch collection and its items
  const {
    data: collection,
    isLoading,
    refetch,
  } = useQuery<ICollection>(['collection', id], () =>
    getCollection(!id || Array.isArray(id) ? '22' : id)
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
      onSuccess: () => {
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

  //handle update collection property mutation
  const updateCollectioDescriptionMutation = useMutation(
    async (description: string) => {
      if (!collectionId) return;
      await updateCollectionDescription(collectionId, description);
    },
    {
      onSuccess: () => {
        if (!collectionId) throw 'CollectionId is undefined';

        queryClient.invalidateQueries(['collection', collectionId]);

        positiveFeedback('Description updated');
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
                openNewItemModal={newItemModal.openModal}
                onClickAddDescription={descriptionModal.openModal}>
                <h1 className='font-medium text-3xl'>{collection.name}</h1>
              </Collection.Header>
              <Collection.Description
                hidden={collection.isDescriptionHidden}
                onClickEditDescription={descriptionModal.openModal}>
                {collection.description}
              </Collection.Description>
              <Collection.Body>
                {!isLoading && collection && collection.items.length === 0 ? (
                  // if collection has no items
                  <div
                    className='mt-4 py-1 flex justify-center border-dotted 
                  border-t-2 border-gray-200 dark:border-gray-700'>
                    <button
                      onClick={newItemModal.openModal}
                      className='w-full py-1 flex items-center justify-center 
                      rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'>
                      <span className='icon-sm'>
                        <PlusIcon />
                      </span>
                      <span>New Item</span>
                    </button>
                  </div>
                ) : (
                  //  collection has at leat one item
                  <div>
                    <div
                      className='flex justify-between items-center py-1 border-dotted 
                      border-b-2 border-gray-200 dark:border-gray-700'>
                      {/*Views */}
                      <div className='flex justify-between items-center'>
                        <RadioGroup
                          value={selectedView}
                          onChange={(e) => {
                            setSelectedView(e);
                            close();
                          }}>
                          <div className='max-w-fit flex space-x-1 rounded p-0.5 bg-gray-50 dark:bg-gray-700'>
                            <RadioGroup.Option
                              value='grid'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-green-500  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded shadow-md px-1 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <RadioGroup.Label
                                  as='p'
                                  className={`flex items-center space-x-1  font-medium ${
                                    checked
                                      ? 'text-white'
                                      : 'text-black dark:text-gray-50'
                                  }`}>
                                  <ViewGridIcon className='icon-sm' />
                                </RadioGroup.Label>
                              )}
                            </RadioGroup.Option>

                            <RadioGroup.Option
                              value='list'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-green-500  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded shadow-md p-0.5 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <RadioGroup.Label
                                  as='p'
                                  className={`flex items-center space-x-1 font-medium ${
                                    checked
                                      ? 'text-white'
                                      : 'text-black dark:text-gray-50'
                                  }`}>
                                  <ViewListIcon className='icon-sm' />
                                </RadioGroup.Label>
                              )}
                            </RadioGroup.Option>

                            <RadioGroup.Option
                              value='table'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-green-500  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded shadow-md p-0.5 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <RadioGroup.Label
                                  as='p'
                                  className={`flex items-center space-x-1 font-medium ${
                                    checked
                                      ? 'text-white'
                                      : 'text-black dark:text-gray-50'
                                  }`}>
                                  <TableIcon className='icon-sm' />
                                </RadioGroup.Label>
                              )}
                            </RadioGroup.Option>
                          </div>
                        </RadioGroup>
                      </div>
                      <button
                        onClick={newItemModal.openModal}
                        className='btn btn-primary'>
                        <span className='icon-sm'>
                          <PlusIcon />
                        </span>
                        <span>New</span>
                      </button>
                    </div>

                    {/*Dispay all collection's item */}
                    <div
                      className={` 
                  ${selectedView === 'list' && 'flex flex-col space-y-1.5'}
                  ${
                    selectedView === 'grid' &&
                    'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full '
                  } 
                  
                  pt-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300
                   dark:scrollbar-thumb-gray-600 `}>
                      {/* Table view is selected  */}
                      {selectedView === 'table' && (
                        <table
                          className='w-full border-separate border-spacing-2 
                 border-gray-300 dark:border-gray-600'>
                          <thead>
                            <tr>
                              <th className='rounded-tl border-2 border-gray-300 dark:border-gray-600'>
                                Name
                              </th>
                              {collection.properties.map((property) => (
                                <th
                                  key={property._id}
                                  className='last:rounded-tr border-2 border-gray-300 dark:border-gray-600'>
                                  {property.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {itemsQueries.map(
                              ({ data: item }) =>
                                item && (
                                  <ItemRow
                                    key={item._id}
                                    item={item}
                                    collectionProperties={collection.properties}
                                    onItemClick={handleOnClickItem}
                                  />
                                )
                            )}
                          </tbody>
                        </table>
                      )}
                      {selectedView !== 'table' &&
                        itemsQueries.map(({ data: item, isLoading }) =>
                          isLoading ? (
                            <div className='flex flex-col space-y-1 p-1  animate-pulse rounded bg-gray-100 dark:bg-gray-800'>
                              <div className='w-1/3 h-4  rounded-md bg-gray-300 dark:bg-gray-600'></div>
                              <div className='w-1/5 h-5 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                            </div>
                          ) : (
                            item && (
                              <ItemOverview
                                key={item._id}
                                item={item}
                                collectionProperty={collection.properties}
                                onItemClick={handleOnClickItem}
                              />
                            )
                          )
                        )}
                    </div>
                  </div>
                )}
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
      {/* Edit description */}
      {collection && descriptionModal.isOpen && (
        <EditDescriptionModal
          description={collection.description}
          open={descriptionModal.isOpen}
          handleClose={descriptionModal.closeModal}
          onSave={updateCollectioDescriptionMutation.mutate}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
