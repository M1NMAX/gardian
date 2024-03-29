import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DeleteModal from '@components/DeleteModal';
import Header from '@components/Header';
import RenameModal from '@components/RenameModal';
import Sidebar from '@components/Sidebar';
import { SORT_ASCENDING, SORT_DESCENDING } from '@constants';
import { SidebarProvider } from '@context/SidebarContext';
import { CollectionMenu, useCollection } from '@features/collections';
import { Editor } from '@features/Editor';
import { Icon } from '@features/Icons';
import {
  CreateItemModal,
  getItems,
  ItemMenu,
  ItemOverview,
  useGetItem,
  useItem
} from '@features/items';
import { Property } from '@features/properties';
import { SortOptionsListbox, useSort } from '@features/sort';
import { ViewButton } from '@features/view';
import { ActionIcon, Button, Drawer } from '@frontstate-ui';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FolderIcon } from '@heroicons/react/24/solid';
import useDrawer from '@hooks/useDrawer';
import useModal from '@hooks/useModal';
import {
  Item,
  ItemProperty,
  Prisma,
  Property as PropertyModel,
  PropertyType
} from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SortOptionType } from '@types';


const rand = 'randomId';
const sortOptions: SortOptionType[] = [
  { field: 'name', order: SORT_ASCENDING },
  { field: 'name', order: SORT_DESCENDING },
  { field: 'createdAt', order: SORT_ASCENDING },
  { field: 'createdAt', order: SORT_DESCENDING },
];

const Collections: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');
  const loadingFeedback = (msg: string) => toast.loading(msg);

  //Modals
  const createItemModal = useModal();
  const renameItemModal = useModal();
  const deleteItemModal = useModal();
  const renameCollectionModal = useModal();
  const deleteCollectionModal = useModal();

  //Drawer
  const drawer = useDrawer(() => setSelectedItemId(null));

  //View
  const [isGridView, setIsGridView] = useState<boolean>(false);

  //Fetch
  const queryClient = useQueryClient();
  //Fetch collection
  const collection = useCollection(typeof id === 'string' ? id : rand);
  const collectionData = collection.query.data;
  const isLoading = collection.query.isLoading;

  useEffect(() => {
    collection.query.refetch();
    drawer.closeDrawer();
  }, [id]);

  const collectionId = collectionData?.id;

  //Fetch collection items
  const items = useQuery(
    ['items', collectionId],
    () => getItems(collectionId || rand),
    { enabled: !!collectionId }
  );

  //Sort items
  const {
    selectedSortOption,
    sortedList: sortedItems,
    reorder,
    onChangeSortOption,
  } = useSort(sortOptions[0], items.data ?? [], items.isFetched);

  //Collection mutation
  const handleCreateItem = (name: string) => {
    if (!collectionData) throw 'Collection is undefined';

    //create placeholder for all collection properties inside of item
    const properties: ItemProperty[] = collectionData.properties.map(
      (property) => ({
        id: property.id,
        value: '',
      })
    );
    const item = { name, collectionId: collectionData.id, properties };

    collection.createItemMutateFun(item, {
      onSuccess: async (data) => {
        if (!items.data) return;

        positiveFeedback('Item added');
        collection.query.refetch();
        setSelectedItemId(data.id);
        reorder([...items.data, data]);
        drawer.openDrawer();
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        createItemModal.closeModal();
      },
    });
  };

  //handle rename collection and its mutation
  const handleRenameCollection = (name: string) => {
    collection.renameCollectionMutateFun(name, {
      onSuccess: () => {
        positiveFeedback('Collection renamed');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => renameCollectionModal.closeModal(),
    });
  };

  //handle toggle collection favourite state mutation
  const handleCollectionIsFavState = () => {
    if (!collectionId) return;
    collection.toggleIsFavStateMutateFun(collectionId, {
      onError: () => {
        negativeFeedback();
      },
    });
  };

  //handle toggle collection description state mutation
  const handleCollectionDescState = () => {
    if (!collectionId) return;
    collection.toggleDescrStateMutateFun(collectionId, {
      onError: () => {
        negativeFeedback();
      },
    });
  };

  //handle update collection description and its mutation
  const handleUpdateCollectionDesc = (description: string) => {
    if (!collectionId) return;
    collection.updCollectionDescrMutateFun(description, {
      onError: () => {
        negativeFeedback();
      },
    });
  };

  //handle delete collection and its mutation
  const handleDeleteCollection = () => {
    if (!collectionId) return;

    collection.deleteCollectionMutateFun(collectionId, {
      onSuccess: () => {
        positiveFeedback('Collection deleted');
        router.push('/collections');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => deleteCollectionModal.closeModal(),
    });
  };
  //End Collection mutation

  //Handle selected item
  //selectedItem hold item data and some utils function
  //selectedItemMutations hold all selected item mutate fun
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = useGetItem(selectedItemId || rand);
  const selectedItemMutations = useItem(
    selectedItemId || rand,
    collectionId || rand
  );

  const handleOnClickItem = (id: string) => {
    setSelectedItemId(id);
    drawer.openDrawer();
  };

  //Item mutation
  //Handle rename item mutation
  const handleRenameItem = (name: string) => {
    selectedItemMutations.renameItemMutateFun(name, {
      onSuccess: () => {
        positiveFeedback('Item renamed');
        selectedItem.refetch();
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        renameItemModal.closeModal();
      },
    });
  };

  //Handle update item property
  const handlePropertyValueChange = (id: string, value: string): void => {
    if (!id || !selectedItemId) return;

    selectedItem.setPropertyValue(id, value);
    selectedItemMutations.updateItemPropertyMutateFun(
      { id: selectedItemId, property: { id, value } },
      {
        onSuccess: async () => {
          if (!collectionId) return;
          await items.refetch();

          const itemsQueryData = queryClient.getQueriesData<Item[]>([
            'items',
            collectionId,
          ]);
          const onlyItems = itemsQueryData[0][1];

          reorder(onlyItems);
        },
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };

  const handleDuplicateSelectedItem = () => {
    if (!collectionId || !selectedItem) return;
    const name = selectedItem.name;
    const properties = selectedItem.properties;

    const item = { name: name + '(copy)', collectionId, properties };

    collection.createItemMutateFun(item, {
      onSuccess: async (data) => {
        if (!items.data) return;
        positiveFeedback('Item added');
        collection.query.refetch();
        setSelectedItemId(data.id);
        reorder([...items.data, data]);
        drawer.openDrawer();
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        createItemModal.closeModal();
      },
    });
  };

  //Handle delete item mutation
  const handleDeleteItem = () => {
    if (!selectedItemId) return;

    selectedItemMutations.deleteItemMutateFun(selectedItemId, {
      onSuccess: async () => {
        if (!collectionId) return;
        await items.refetch();

        const itemsQueryData = queryClient.getQueriesData<Item[]>([
          'items',
          collectionId,
        ]);
        const onlyItems = itemsQueryData[0][1];

        reorder(onlyItems);
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
  };

  //handle user interation with property menu
  const handleOnClickAddProperty = async () => {
    const property = { name: 'Property', type: PropertyType.TEXT, options: [] };

    const toastId = loadingFeedback('Adding property to all items ...');

    collection.addPropertyToCollectionMutateFun(property, {
      onSuccess: () => {
        selectedItem.refetch();
        positiveFeedback('Property added');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });
  };

  const handleDuplicateProperty = async (
    property: Prisma.PropertyUpdateInput
  ) => {
    const toastId = loadingFeedback('Adding property to all items ...');

    collection.addPropertyToCollectionMutateFun(property, {
      onSuccess: async () => {
        await selectedItem.refetch();
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });
  };

  const handleUpdateProperty = async (property: PropertyModel) => {
    collection.updateCollectionPropertyMutateFun(property, {
      onSuccess: () => {
        positiveFeedback('Property updated');
      },
      onError: () => {
        negativeFeedback();
      },
    });
  };

  const handleDeleteProperty = async (pid: string) => {
    const toastId = loadingFeedback('Removing property from all items...');

    collection.deleteCollectionPropertyMutateFun(pid, {
      onSuccess: async () => {
        await selectedItem.refetch();
        positiveFeedback('Property removed');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });
  };

  return (
    <>
      <Head>
        <title> Collection name</title>
      </Head>

      <SidebarProvider>
        <div className='flex h-screen overflow-hidden'>
          <Sidebar />
          <main
            className={`main-content ${
              drawer.isOpen ? 'w-0 md:2/3' : 'w-full'
            }`}>
            {/* Header  */}
            <Header>
              <div className='grow flex items-center space-x-1 font-semibold'>
                {collectionData && (
                  <Icon
                    icon={collectionData.icon}
                    defaultIcon={<FolderIcon />}
                  />
                )}

                <h1 className='text-2xl'>
                  {collectionData ? collectionData.name : 'Loading'}
                </h1>
                <ActionIcon onClick={renameCollectionModal.openModal}>
                  <PencilIcon className='icon-xxs' />
                </ActionIcon>
              </div>
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
                  onChangeOption={onChangeSortOption}
                />
                {/* views  */}
                <ViewButton
                  isGrid={isGridView}
                  onClick={() => setIsGridView(!isGridView)}
                />

                {collectionData && (
                  <CollectionMenu
                    isFavourite={collectionData.isFavourite}
                    isDescriptionHidden={collectionData.isDescriptionHidden}
                    onClickNewItem={createItemModal.openModal}
                    onClickDescription={handleCollectionDescState}
                    onClickFavourite={handleCollectionIsFavState}
                    onClickRename={renameCollectionModal.openModal}
                    onClickDelete={deleteCollectionModal.openModal}
                  />
                )}
              </div>
            </Header>
            <div className='grow px-4 space-y-1.5 '>
              {collectionData && (
                <div
                  className={`${
                    collectionData.isDescriptionHidden && 'hidden'
                  }`}>
                  <Editor
                    initialText={collectionData.description}
                    onSave={handleUpdateCollectionDesc}
                  />
                </div>
              )}

              {items.isLoading &&
                collectionData &&
                [...Array(collectionData._count.items)].map((i: string) => (
                  <div
                    key={i}
                    className='flex flex-col space-y-1 p-1  animate-pulse rounded
                   bg-gray-100 dark:bg-gray-800'>
                    <div className='w-1/3 h-4  rounded-md bg-gray-300 dark:bg-gray-600'></div>
                    <div className='w-1/5 h-5 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                  </div>
                ))}

              {!isLoading &&
                collectionData &&
                collectionData._count.items === 0 && (
                  <button
                    onClick={createItemModal.openModal}
                    className='w-full py-1 flex items-center justify-center 
                      rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'>
                    <span className='icon-sm'>
                      <PlusIcon />
                    </span>
                    <span>New Item</span>
                  </button>
                )}

              {/*Dispay all collection's item */}
              {!items.isLoading && collectionData && sortedItems.length >= 0 && (
                <div
                  className={` py-2 ${
                    isGridView
                      ? 'grid grid-cols-2 gap-1 lg:gap-1.5 max-h-full'
                      : 'flex flex-col space-y-2'
                  } ${
                    isGridView && drawer.isOpen
                      ? 'lg:grid-cols-2'
                      : 'lg:grid-cols-3'
                  } `}>
                  {sortedItems.map((item) => (
                    <ItemOverview
                      key={item.id}
                      item={item}
                      active={selectedItemId === item.id}
                      collectionProperty={collectionData.properties}
                      onItemClick={handleOnClickItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
          {selectedItemId && (
            <Drawer
              opened={drawer.isOpen}
              onClose={drawer.closeDrawer}
              title={
                <div className='flex items-center space-x-1 font-semibold'>
                  <h1 className='text-2xl'>{selectedItem.name}</h1>
                  <ActionIcon onClick={renameItemModal.openModal}>
                    <PencilIcon className='icon-xxs' />
                  </ActionIcon>
                </div>
              }
              menu={
                <ItemMenu
                  onClickAddProperty={handleOnClickAddProperty}
                  onClickDuplicate={handleDuplicateSelectedItem}
                  onClickDelete={deleteItemModal.openModal}
                />
              }>
              <div className='grow space-y-1.5 pt-1.5 overflow-y-auto scrollbar-none'>
                {selectedItem.properties.map((property) => (
                  <Property
                    key={property.id}
                    collectionProperty={collection.getPropertyById(property.id)}
                    getValue={selectedItem.getPropertyValue}
                    setValue={handlePropertyValueChange}
                    onPropertyUpdate={handleUpdateProperty}
                    onPropertyDuplicate={handleDuplicateProperty}
                    onPropertyDelete={handleDeleteProperty}
                  />
                ))}
              </div>
              <div>
                <Button
                  onClick={handleOnClickAddProperty}
                  variant='primary-filled'
                  full>
                  <PlusIcon className='icon-sm' />
                  <span>Add Property</span>
                </Button>
              </div>
            </Drawer>
          )}
        </div>
      </SidebarProvider>
      {/* create item modal  */}
      {collectionData && createItemModal.isOpen && (
        <CreateItemModal
          open={createItemModal.isOpen}
          handleClose={createItemModal.closeModal}
          onCreateItem={handleCreateItem}
        />
      )}

      {/* rename item modal  */}
      {selectedItemId && renameItemModal.isOpen && (
        <RenameModal
          open={renameItemModal.isOpen}
          handleClose={renameItemModal.closeModal}
          name={selectedItem.name}
          onRename={handleRenameItem}
        />
      )}
      {/* Delete item modal  */}
      {selectedItemId && deleteItemModal.isOpen && (
        <DeleteModal
          open={deleteItemModal.isOpen}
          handleClose={deleteItemModal.closeModal}
          onDelete={handleDeleteItem}>
          <h2>
            Are you sure about delete item{' '}
            <span className='italic'>{selectedItem.name}</span>?
          </h2>
        </DeleteModal>
      )}

      {/* rename Collection modal  */}
      {collectionData && renameCollectionModal.isOpen && (
        <RenameModal
          open={renameCollectionModal.isOpen}
          handleClose={renameCollectionModal.closeModal}
          name={collectionData.name}
          onRename={handleRenameCollection}
        />
      )}

      {/* delete Collection modal  */}
      {collectionData && deleteCollectionModal.isOpen && (
        <DeleteModal
          open={deleteCollectionModal.isOpen}
          handleClose={deleteCollectionModal.closeModal}
          onDelete={handleDeleteCollection}>
          <h2>
            Are you sure about delete collection{' '}
            <span className='italic'>{collectionData.name}</span>? All{' '}
            <span className='italic'>{collectionData.name}</span> items will be
            deleted
          </h2>
        </DeleteModal>
      )}
    </>
  );
};

export default Collections;
