import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ICollection, IItem, IItemProperty, IProperty } from '../../interfaces';
import {
  CollectionMenu,
  useUpdateCollectionMutation,
  useToggleCollectionProperty,
  useDeleteCollectionMutation,
} from '../../features/collections';
import {
  addPropertyToItem,
  deleteItem,
  getItem,
  getItems,
  removePropertyFromItem,
  renameItem,
  updateItemProperty,
} from '../../services/item';
import { ActionIcon, Drawer } from '../../components/frontstate-ui';
import { CreateItemModal, ItemOverview, ItemMenu } from '../../features/items';
import {
  PlusIcon,
  ViewBoardsIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import useModal from '../../hooks/useModal';
import toast from 'react-hot-toast';
import {
  addPropertyToCollection,
  removePropertyFromCollection,
  removeItemFromCollection,
  updateCollectionProperty,
  getCollection,
  updateCollectionDescription,
  renameCollection,
  deleteCollection,
  toggleCollectionDescriptionState,
  toggleCollectionIsFavourite,
} from '../../services/collections';
import DeleteModal from '../../components/DeleteModal';
import Property from '../../components/Property';
import { Editor } from '../../features/Editor';
import useDrawer from '../../hooks/useDrawer';
import Header from '../../components/Header';
import SortOptionsListbox from '../../components/SortOptionsListbox';
import sortFun, {
  SortOptionType,
  SORT_ASCENDING,
  SORT_DESCENDING,
} from '../../utils/sort';
import RenameModal from '../../components/RenameModal';

const rand = 'randomId';
const sortOptions: SortOptionType[] = [
  { field: 'name', order: SORT_ASCENDING },
  { field: 'name', order: SORT_DESCENDING },
  { field: 'createdAt', order: SORT_ASCENDING },
  { field: 'createdAt', order: SORT_DESCENDING },
];

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const { id } = router.query;
  const sidebar = useRecoilValue(sidebarState);

  //Drawer
  const drawer = useDrawer(() => setSelectedItemId(null));

  //View
  const [isGridView, setIsGridView] = useState<boolean>(false);

  //Fetch and cache
  const queryClient = useQueryClient();
  //Fetch collection and its items
  const {
    data: collection,
    isLoading,
    refetch,
  } = useQuery<ICollection>(['collection', id], () =>
    id && !Array.isArray(id) ? getCollection(id) : ({} as ICollection)
  );

  useEffect(() => {
    refetch();
    drawer.closeDrawer();
  }, [id]);

  const collectionId = collection?._id;

  //Fetch collection items
  const { data: items, isLoading: isItemsLoading } = useQuery(
    ['items', collectionId],
    () => (collection ? getItems(collection.items) : []),
    { enabled: !!collectionId }
  );

  //Sort items
  const [selectedSortOption, setSelectedSortOption] = useState<SortOptionType>(
    sortOptions[0]
  );
  const [sortedItems, setSortedItems] = useState<IItem[]>([]);

  useEffect(() => {
    if (!items) return;
    setSortedItems(
      items.sort(sortFun(selectedSortOption.order, selectedSortOption.field))
    );
  }, [items]);

  const handleOnChangeSortParam = (option: SortOptionType) => {
    const data = sortedItems
      .slice()
      .sort(sortFun(selectedSortOption.order, selectedSortOption.field));
    setSortedItems(data);
    setSelectedSortOption(option);
  };

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  //Modals
  const createItemModal = useModal();
  const deleteItemModal = useModal();
  const renameCollectionModal = useModal();
  const deleteCollectionModal = useModal();

  //Mutations
  //Collection mutation
  //handle rename collection and its mutation
  const renameCollectionMut = useUpdateCollectionMutation(
    collectionId || rand,
    async (value) => {
      if (!collectionId) return;
      await renameCollection(collectionId, value);
    },
    () => positiveFeedback('Renamed'),
    () => negativeFeedback()
  );

  const handleRenameCollection = (name: string) => {
    renameCollectionMut(name);
    renameCollectionModal.closeModal();
  };

  //handle toggle collection description state mutation
  const toggleCollectionDescState = useToggleCollectionProperty(
    collectionId || rand,
    async () => {
      if (!collectionId) return;
      await toggleCollectionDescriptionState(collectionId);
    },
    () => {},
    () => negativeFeedback()
  );

  //handle toggle collection favourite state mutation
  const toggleCollectionFavState = useToggleCollectionProperty(
    collectionId || rand,
    async () => {
      if (!collectionId) return;
      await toggleCollectionIsFavourite(collectionId);
    },
    () => {},
    () => negativeFeedback()
  );

  //handle update collection description and its mutation
  const updateCollectionDescMutation = useUpdateCollectionMutation(
    collectionId || rand,
    async (value) => {
      if (!collectionId) return;
      await updateCollectionDescription(collectionId, value);
    },
    () => {},
    () => negativeFeedback()
  );

  //handle delete collection and its mutation
  const deleteCollection = useDeleteCollectionMutation(
    collectionId || rand,
    () => {
      positiveFeedback('Collection deleted');
      router.push('/collections');
    },
    () => negativeFeedback()
  );

  const handleDeleteCollection = () => {
    if (!collectionId) return;

    deleteCollection.mutate(collectionId);
    deleteCollectionModal.closeModal();
  };
  //End Collection mutation

  //Handle rename item mutation
  const renameItemMutation = useMutation(
    async (name: string) => {
      if (name === '') return;
      if (!selectedItemId) return;
      await renameItem(selectedItemId, name);
    },
    {
      onSuccess: async () => {
        if (!collectionId) throw 'CollectionId is undefined';
        if (!selectedItemId) throw 'CurrentItemId is undefined';

        queryClient.invalidateQueries(['items', collectionId, selectedItemId]);
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  //Handle update item mutation
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
      drawer.closeDrawer();
    },
    onError: () => {
      negativeFeedback();
    },
    onSettled: () => {
      deleteItemModal.closeModal();
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

  const handleOnClickItem = (id: string) => {
    setSelectedItemId(id);
    drawer.openDrawer();
  };

  //Handle selected item
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [selectedItemUpdateTs, setSelectedItemUpdateTs] = useState<Date>();
  const [selectedItemPorperties, setSelectedItemPorperties] = useState<
    IItemProperty[]
  >([]);

  //Fetch the selected item data
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

  const getCollectionPropertyById = (id: string) => {
    if (!id || !collection) return {} as IProperty;

    const property = collection.properties.find(
      (property) => property._id === id
    );

    return property || ({} as IProperty);
  };

  const setPropertyValue = (id: string, value: string): void => {
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

  const getPropertyValue = (id: string): string => {
    if (!id) return '';
    const property = selectedItemPorperties.find(
      (property) => property._id === id
    );
    if (!property) return '';
    return property.value;
  };

  //Util function that add the lastest collection property
  //to all collection items
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
        values: [],
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

  const handleDeleteProperty = async (propertyId: string) => {
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
        } main-content flex `}>
        <div
          className={`${
            drawer.isOpen ? 'w-0 md:w-3/5' : 'w-full'
          } pb-2 h-full overflow-y-scroll scrollbar-thin
          scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scroll-smooth`}>
          {/* Header  */}
          <Header>
            <h1 className='grow font-semibold text-xl md:text-2xl pl-1 border-l-4 border-primary-100'>
              {collection ? collection.name : 'Loading'}
            </h1>
            <div className='flex items-center space-x-1.5'>
              {/* new item btn  */}
              <button
                onClick={createItemModal.openModal}
                className='btn btn-primary'>
                <span className='icon-sm'>
                  <PlusIcon />
                </span>
                <span className='hidden md:block'>New Item</span>
              </button>
              {/*SORT */}
              <SortOptionsListbox
                sortOptions={sortOptions}
                selectedOption={selectedSortOption}
                onChangeOption={handleOnChangeSortParam}
              />
              {/* views  */}
              <ActionIcon
                variant='filled'
                onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? (
                  <ViewGridIcon />
                ) : (
                  <ViewBoardsIcon className='rotate-90' />
                )}
              </ActionIcon>

              {collection && (
                <CollectionMenu
                  isDescriptionHidden={collection.isDescriptionHidden}
                  onClickNewItem={createItemModal.openModal}
                  onClickDesctiption={toggleCollectionDescState}
                  onClickRename={renameCollectionModal.openModal}
                  onClickDelete={deleteCollectionModal.openModal}
                />
              )}
            </div>
          </Header>
          <div className='grow px-4 space-y-1.5 '>
            {collection && (
              <div className={`${collection.isDescriptionHidden && 'hidden'}`}>
                <Editor
                  initialText={collection.description}
                  onSave={updateCollectionDescMutation}
                />
              </div>
            )}

            {isItemsLoading &&
              collection &&
              collection.items.map((_) => (
                <div className='flex flex-col space-y-1 p-1  animate-pulse rounded bg-gray-100 dark:bg-gray-800'>
                  <div className='w-1/3 h-4  rounded-md bg-gray-300 dark:bg-gray-600'></div>
                  <div className='w-1/5 h-5 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                </div>
              ))}

            {!isLoading && collection && collection.items.length === 0 && (
              <div
                className='py-1 flex justify-center border-dotted 
                  border-t-2 border-gray-200 dark:border-gray-700'>
                <button
                  onClick={createItemModal.openModal}
                  className='w-full py-1 flex items-center justify-center 
                      rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'>
                  <span className='icon-sm'>
                    <PlusIcon />
                  </span>
                  <span>New Item</span>
                </button>
              </div>
            )}

            {/*Dispay all collection's item */}
            {!isItemsLoading && collection && sortedItems.length >= 0 && (
              <div
                className={`${
                  isGridView
                    ? 'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full'
                    : 'flex flex-col space-y-2'
                } py-2 `}>
                {sortedItems.map((item) => (
                  <ItemOverview
                    key={item._id}
                    item={item}
                    active={selectedItemId === item._id}
                    collectionProperty={collection.properties}
                    onItemClick={handleOnClickItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedItemId && (
          <Drawer
            opened={drawer.isOpen}
            onClose={drawer.closeDrawer}
            title={
              <input
                value={selectedItemName}
                onChange={(e) => setSelectedItemName(e.target.value)}
                onBlur={(e) => renameItemMutation.mutate(e.target.value)}
                className='w-full p-1 font-semibold cursor-default rounded-sm border-0 
               bg-gray-100 dark:bg-gray-800 
            focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-primary-200'
              />
            }
            menu={
              <ItemMenu
                onClickAddProperty={handleOnClickAddProperty}
                onClickDelete={deleteItemModal.openModal}
              />
            }>
            <Drawer.Body>
              <div
                className='space-y-2 pt-1 px-0.5 border-dotted 
                      border-t-2 border-gray-200 dark:border-gray-700'>
                <button
                  onClick={handleOnClickAddProperty}
                  className='btn btn-primary'>
                  <PlusIcon className='icon-sm' />
                  <span>Add Property</span>
                </button>
                {selectedItemPorperties.map(
                  (property) =>
                    property._id && (
                      <Property
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
              </div>
            </Drawer.Body>
          </Drawer>
        )}
      </main>
      {/* create item modal  */}
      {collection && createItemModal.isOpen && (
        <CreateItemModal
          open={createItemModal.isOpen}
          handleClose={createItemModal.closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
          collection={collection}
        />
      )}
      {/* Delete item modal  */}
      {selectedItemId && deleteItemModal.isOpen && (
        <DeleteModal
          name={selectedItemName}
          open={deleteItemModal.isOpen}
          handleClose={deleteItemModal.closeModal}
          onDelete={() => deleteItemMutation.mutate(selectedItemId)}
        />
      )}

      {/* rename Collection modal  */}
      {collection && renameCollectionModal.isOpen && (
        <RenameModal
          open={renameCollectionModal.isOpen}
          handleClose={renameCollectionModal.closeModal}
          name={collection.name}
          onRename={handleRenameCollection}
        />
      )}

      {/* delete Collection modal  */}
      {collection && deleteCollectionModal.isOpen && (
        <DeleteModal
          open={deleteCollectionModal.isOpen}
          handleClose={deleteCollectionModal.closeModal}
          name={collection.name}
          onDelete={handleDeleteCollection}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
