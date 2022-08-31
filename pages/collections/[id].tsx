import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useQuery } from 'react-query';
import { IGroup, IItemProperty, IProperty } from '../../interfaces';
import { CollectionMenu, useCollection } from '../../features/collections';
import { ActionIcon, Button, Drawer } from '../../components/frontstate-ui';
import {
  CreateItemModal,
  ItemOverview,
  ItemMenu,
  useGetItem,
  useItem,
  getItems,
} from '../../features/items';
import {
  FolderIcon,
  PencilIcon,
  PlusIcon,
  ViewBoardsIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import useModal from '../../hooks/useModal';
import toast from 'react-hot-toast';
import DeleteModal from '../../components/DeleteModal';
import Property from '../../components/Property';
import { Editor } from '../../features/Editor';
import useDrawer from '../../hooks/useDrawer';
import Header from '../../components/Header';
import RenameModal from '../../components/RenameModal';
import { useSort, SortOptionsListbox } from '../../features/sort';
import { SORT_ASCENDING, SORT_DESCENDING } from '../../constants';
import { SortOptionType } from '../../types';
import { getGroupWithCid } from '../../features/groups';

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

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

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
  //Fetch group information
  const [groupInfo, setGroupInfo] = useState<IGroup>();
  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchGroupInfo = async (cid: string) => {
      const result = await getGroupWithCid(cid);
      setGroupInfo(result);
    };

    fetchGroupInfo(id);
  }, [id]);

  //Fetch collection
  const collection = useCollection(
    id && !Array.isArray(id) ? id : rand,
    groupInfo && groupInfo._id ? groupInfo._id : rand
  );
  const collectionData = collection.query.data;
  const isLoading = collection.query.isLoading;

  useEffect(() => {
    collection.query.refetch();
    drawer.closeDrawer();
  }, [id]);

  const collectionId = collectionData?._id;

  //Fetch collection items
  const { data: items, isLoading: isItemsLoading } = useQuery(
    ['items', collectionId],
    () => (collectionData ? getItems(collectionData.items) : []),
    { enabled: !!collectionId }
  );

  //Sort items
  const {
    selectedSortOption,
    sortedList: sortedItems,
    onChangeSortOption,
  } = useSort(sortOptions[0], items || []);

  //Collection mutation
  const handleCreateItem = (name: string) => {
    if (!collectionData) throw 'Collection is undefined';

    //create placeholder for all collection properties inside of item
    const properties: IItemProperty[] = collectionData.properties.map(
      (property) => ({
        _id: property._id,
        value: '',
      })
    );

    collection.createItemMutateFun(
      { name, properties },
      {
        onSuccess: async ({ _id: itemId }) => {
          if (!itemId) throw 'Item id is undefined';
          positiveFeedback('Item added');
          collection.query.refetch();
          setSelectedItemId(itemId);
          drawer.openDrawer();
        },
        onError: () => {
          negativeFeedback();
        },
        onSettled: () => {
          createItemModal.closeModal();
        },
      }
    );
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
        positiveFeedback('DELETE');
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
      {
        itemId: selectedItemId,
        propertyId: id,
        property: { _id: id, value },
      },
      {
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };
  //Handle delete item mutation
  const handleDeleteItem = () => {
    if (!collectionId || !selectedItemId) return;

    selectedItemMutations.deleteItemMutateFun(selectedItemId, {
      onSuccess: async () => {
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
    if (!collectionId) return;
    collection.addPropertyToCollectionMutateFun(
      {
        collectionId,
        property: { name: 'property', type: 'text', values: [] },
      },
      {
        onSuccess: () => {
          selectedItem.refetch();
        },
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };

  const handleDuplicateProperty = async (property: IProperty) => {
    if (!collectionId) return;
    collection.addPropertyToCollectionMutateFun(
      { collectionId, property },
      {
        onSuccess: () => {
          selectedItem.refetch();
        },
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };

  const handleUpdateProperty = async (property: IProperty) => {
    if (!collectionId || !property._id) return;

    collection.updateCollectionPropertyMutateFun(
      { collectionId, propertyId: property._id, property },
      {
        onSuccess: () => {
          positiveFeedback('Property updated');
        },
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!collectionId) return;

    collection.deleteCollectionPropertyMutateFun(
      { collectionId, propertyId },
      {
        onSuccess: () => {
          positiveFeedback('Property removed');
        },
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title> {collectionData ? collectionData.name : 'Loading...'}</title>
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
            <div className='grow flex items-center space-x-1 font-semibold'>
              {!collectionData ||
                (collectionData.icon === '' && (
                  <FolderIcon className='icon-sm' />
                ))}
              {collectionData && collectionData.icon !== '' && (
                <span className='relative icon-sm'>
                  <Image
                    src={`/icons/${collectionData.icon}.svg`}
                    alt={collectionData.icon}
                    layout='fill'
                    objectFit='contain'
                  />
                </span>
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
              <ActionIcon
                variant='filled'
                onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? (
                  <ViewGridIcon className='icon-sm' />
                ) : (
                  <ViewBoardsIcon className='icon-sm rotate-90' />
                )}
              </ActionIcon>

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
                className={`${collectionData.isDescriptionHidden && 'hidden'}`}>
                <Editor
                  initialText={collectionData.description}
                  onSave={handleUpdateCollectionDesc}
                />
              </div>
            )}

            {isItemsLoading &&
              collectionData &&
              collectionData.items.map((_) => (
                <div className='flex flex-collection space-y-1 p-1  animate-pulse rounded bg-gray-100 dark:bg-gray-800'>
                  <div className='w-1/3 h-4  rounded-md bg-gray-300 dark:bg-gray-600'></div>
                  <div className='w-1/5 h-5 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                </div>
              ))}

            {!isLoading && collectionData && collectionData.items.length === 0 && (
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
            {!isItemsLoading && collectionData && sortedItems.length >= 0 && (
              <div
                className={`${
                  isGridView
                    ? 'grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-1.5 max-h-full'
                    : 'flex flex-col space-y-2'
                } py-2 `}>
                {sortedItems.map(
                  (item) =>
                    item && (
                      <ItemOverview
                        key={item._id}
                        item={item}
                        active={selectedItemId === item._id}
                        collectionProperty={collectionData.properties}
                        onItemClick={handleOnClickItem}
                      />
                    )
                )}
              </div>
            )}
          </div>
        </div>

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
                onClickDelete={deleteItemModal.openModal}
              />
            }>
            <div
              className='grow space-y-1.5 pr-2.5 pt-0.5 overflow-y-auto scrollbar-thin
                      scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
              {selectedItem.properties.map(
                (property) =>
                  property._id && (
                    <Property
                      collectionProperty={collection.getCollectionPropertyById(
                        property._id
                      )}
                      getValue={selectedItem.getPropertyValue}
                      setValue={handlePropertyValueChange}
                      onPropertyUpdate={handleUpdateProperty}
                      onPropertyDuplicate={handleDuplicateProperty}
                      onPropertyDelete={handleDeleteProperty}
                    />
                  )
              )}
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
      </main>
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

export const getServerSideProps = withPageAuthRequired();
