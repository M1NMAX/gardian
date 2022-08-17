import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  addItemToCollection,
  createCollection,
  deleteCollection,
  getCollection,
  renameCollection,
  toggleCollectionIsFavourite,
} from '../../../fetch/collections';
import RenameModal from '../../RenameModal';
import DeleteModal from '../../DeleteModal';
import useModal from '../../../hooks/useModal';
import SidebarCollectionMenu from '../SidebarCollectionMenu';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import MoveCollectionModal from '../../MoveCollectionModal';
import {
  addCollectionToGroup,
  removeCollectionFromGroup,
} from '../../../fetch/group';
import { createItem, getItem } from '../../../fetch/item';

interface SidebarCollectionProps {
  collectionId: string;
  groupId: number;
  onClick: () => void;
}

const SidebarCollection: FC<SidebarCollectionProps> = (props) => {
  const { collectionId, groupId, onClick } = props;

  //Fetch collection
  const { data: collection } = useQuery(
    ['sidebarCollection', collectionId],
    () => getCollection(collectionId)
  );

  const router = useRouter();
  const { id: urlId } = router.query;

  //Feedbacks
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  //Modals
  const deleteCollectionModal = useModal();
  const renameCollectionModal = useModal();
  const moveCollectionModal = useModal();

  const queryClient = useQueryClient();

  //handle delete collection and its mutation
  const deleteCollectionMutation = useMutation(
    async () => {
      await deleteCollection(collectionId);
    },
    {
      onSuccess: () => {
        positiveFeedback('Collection deleted');
        queryClient.removeQueries(['sidebarCollection', collectionId]);
        queryClient.removeQueries(['collection', collectionId]);

        if (collectionId === urlId) router.push('/collections');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        deleteCollectionModal.closeModal();
      },
    }
  );

  //handle toggle collection favourite state and its mutation
  const handleToggleFavourite = () =>
    toggleCollectionIsFavouriteMutation.mutate(collectionId);

  const toggleCollectionIsFavouriteMutation = useMutation(
    toggleCollectionIsFavourite,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sidebarCollection', collectionId]);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  //handle collection duplication and its mutation
  const duplicateCollectionMutation = useMutation(
    async () => {
      if (!collection) return;
      const {
        name,
        description,
        properties,
        isDescriptionHidden,
        isFavourite,
      } = collection;
      //Create a collection's copy
      const duplicatedCollection = await createCollection({
        name: name + '(copy)',
        description,
        isDescriptionHidden,
        isFavourite,
        properties,
        items: [],
      });

      collection.items.map(async (itemId) => {
        const { name, properties } = await getItem(itemId);

        const newItem = await createItem({ name, properties });

        if (!newItem._id || !duplicatedCollection._id) return;

        await addItemToCollection(duplicatedCollection._id, newItem._id);
        await addCollectionToGroup(groupId, duplicatedCollection._id);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groups']);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  //handle rename collection and its mutation
  const renameCollectionMutation = useMutation(
    async (name: string) => {
      await renameCollection(collectionId, name);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sidebarCollection', collectionId]);
        queryClient.invalidateQueries(['collection', collectionId]);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        renameCollectionModal.closeModal();
      },
    }
  );

  //handle move collection to another group and its mutation
  const moveCollectionMutation = useMutation(
    async (desGroupId: number) => {
      await removeCollectionFromGroup(groupId, collectionId);
      await addCollectionToGroup(desGroupId, collectionId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groups']);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  if (!collection) return <></>;
  return (
    <>
      <div
        className={`${
          collectionId === urlId &&
          'border-r-2 border-primary-200 bg-gray-300 dark:bg-gray-600'
        } 
        group flex items-center justify-between w-full h-8 px-1.5 mb-1
       hover:bg-gray-300 dark:hover:bg-gray-500 space-x-1 
        font-semibold `}>
        <button className='flex items-center grow' onClick={onClick}>
          <span className='truncate'>{collection.name}</span>
        </button>

        {collection.items.length !== 0 && (
          <span className='flex items-center  md:group-hover:hidden md:group-focus-within:hidden'>
            <span className='text-xs font-light italic'>
              {collection.items.length}
            </span>
          </span>
        )}

        <div className='block md:hidden md:group-hover:block md:group-focus-within:block'>
          <SidebarCollectionMenu
            isFavourite={collection.isFavourite}
            onClickDelete={deleteCollectionModal.openModal}
            onClickAddToFavourite={handleToggleFavourite}
            onClickDuplicate={duplicateCollectionMutation.mutate}
            onClickRename={renameCollectionModal.openModal}
            onClickMove={moveCollectionModal.openModal}
          />
        </div>
      </div>

      {renameCollectionModal.isOpen && (
        <RenameModal
          open={renameCollectionModal.isOpen}
          handleClose={renameCollectionModal.closeModal}
          name={collection.name}
          onRename={renameCollectionMutation.mutate}
        />
      )}

      {moveCollectionModal.isOpen && (
        <MoveCollectionModal
          currentGroupId={groupId}
          open={moveCollectionModal.isOpen}
          handleClose={moveCollectionModal.closeModal}
          onMove={moveCollectionMutation.mutate}
        />
      )}

      {deleteCollectionModal.isOpen && (
        <DeleteModal
          open={deleteCollectionModal.isOpen}
          handleClose={deleteCollectionModal.closeModal}
          name={collection.name}
          onDelete={deleteCollectionMutation.mutate}
        />
      )}
    </>
  );
};

export default SidebarCollection;
