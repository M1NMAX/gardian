import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useQuery, useQueryClient } from 'react-query';
import { ICollection, IItem, IProperty } from '../../interfaces';
import { CollectionMenu, useCollection } from '../../features/collections';
import {
  addPropertyToItem,
  getItems,
  removePropertyFromItem,
} from '../../services/item';
import { ActionIcon, Drawer } from '../../components/frontstate-ui';
import {
  CreateItemModal,
  ItemOverview,
  ItemMenu,
  useGetItem,
  useItem,
} from '../../features/items';
import {
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
import SortOptionsListbox from '../../components/SortOptionsListbox';
import sortFun, {
  SortOptionType,
  SORT_ASCENDING,
  SORT_DESCENDING,
} from '../../utils/sort';
import RenameModal from '../../components/RenameModal';
import { removeItemFromCollection } from '../../services/collections';

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
  const queryClient = useQueryClient();
  //Fetch collection
  const collection = useCollection(id && !Array.isArray(id) ? id : rand);
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

  //Collection mutation
  //handle rename collection and its mutation
  const handleRenameCollection = (name: string) => {
    collection.renameCollectionMutateFun(name, {
      onSuccess: () => {
        positiveFeedback('Success');
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
        router.push('collections');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => deleteCollectionModal.closeModal(),
    });
  };
  //End Collection mutation

  //Handle selected item
  //selected item hold the data and some utils function
  //secondSelected item hold all selected item mutate fun
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = useGetItem(selectedItemId || rand);
  const secondSelectedItem = useItem(
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
    secondSelectedItem.renameItemMutateFun(name, {
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
    secondSelectedItem.updateItemPropertyMutateFun(
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

    secondSelectedItem.deleteItemMutateFun(selectedItemId, {
      onSuccess: async () => {
        await removeItemFromCollection(collectionId, selectedItemId);
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

  //Util
  // add the lastest collection property to all collection items
  const addPorpertyToAllItem = (collection: ICollection) => {
    //get id of the lastest collection's property
    const { _id } = collection.properties[collection.properties.length - 1];

    collection.items.map((itemId) => {
      addPropertyToItem(itemId, { _id, value: '' });
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
        onSuccess(data) {
          addPorpertyToAllItem(data);
          queryClient.invalidateQueries(['items', collectionId]);
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
      {
        collectionId,
        property,
      },
      {
        onSuccess(data) {
          addPorpertyToAllItem(data);
          queryClient.invalidateQueries(['items', collectionId]);
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
          positiveFeedback('DID IT');
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
        onSuccess: async ({ propertyId }) => {
          if (!collection.query.data) return;
          //Remove property from collection items
          collection.query.data.items.map((itemId) =>
            removePropertyFromItem(itemId, propertyId)
          );
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
            <h1 className='grow font-semibold text-xl md:text-2xl pl-1 border-l-4 border-primary-100'>
              {collectionData ? collectionData.name : 'Loading'}
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

              {collectionData && (
                <CollectionMenu
                  isFavourite={collectionData.isFavourite}
                  isDescriptionHidden={collectionData.isDescriptionHidden}
                  onClickNewItem={createItemModal.openModal}
                  onClickDesctiption={handleCollectionDescState}
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
              <div className='flex items-center space-x-2 font-semibold'>
                <h1>{selectedItem.name}</h1>
                <ActionIcon onClick={renameItemModal.openModal}>
                  <PencilIcon />
                </ActionIcon>
              </div>
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
            </Drawer.Body>
          </Drawer>
        )}
      </main>
      {/* create item modal  */}
      {collectionData && createItemModal.isOpen && (
        <CreateItemModal
          open={createItemModal.isOpen}
          handleClose={createItemModal.closeModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
          collection={collectionData}
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
          name={selectedItem.name}
          open={deleteItemModal.isOpen}
          handleClose={deleteItemModal.closeModal}
          onDelete={handleDeleteItem}
        />
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
          name={collectionData.name}
          onDelete={handleDeleteCollection}
        />
      )}
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired();
