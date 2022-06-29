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
} from '../../../../fetch/collections';
import RenameModal from '../../../RenameModal';
import DeleteModal from '../../../DeleteModal';
import useModal from '../../../../hooks/useModal';
import SidebarCollectionMenu from '../SidebarCollectionMenu';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import MoveCollectionModal from '../../../MoveCollectionModal';
import {
  addCollectionToGroup,
  removeCollectionFromGroup,
} from '../../../../fetch/group';
import { createItem, getItem } from '../../../../fetch/item';

interface SidebarCollectionProps {
  collectionId: string;
  groupId: number;
}

const SidebarCollection: FC<SidebarCollectionProps> = (props) => {
  const { collectionId, groupId } = props;

  const { data: collection } = useQuery(
    ['sidebarCollection', collectionId],
    () => getCollection(collectionId)
  );

  const router = useRouter();
  const { id: urlId } = router.query;

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  const renameCollectionModal = useModal();
  const moveCollectionModal = useModal();
  const deleteCollectionModal = useModal();

  //Rename Collection fuction
  const handleDeleteCollection = () => {
    if (!collectionId) return;
    try {
      deleteCollection(collectionId);
      deleteCollectionModal.closeModal();
      positiveFeedback('Collection deleted successfully');
    } catch (error) {
      negativeFeedback();
    }
  };
  const handleToggleFavourite = () =>
    toggleCollectionIsFavouriteMutation.mutate(collectionId);

  const queryClient = useQueryClient();

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
          'border-r-2 border-primary-bright bg-gray-300 dark:bg-gray-600'
        } 
        flex items-center justify-between w-full h-8 px-2 mb-1
       hover:bg-gray-400 dark:hover:bg-gray-500 space-x-1 
        font-semibold `}>
        <Link href={`/collections/${collectionId}`}>
          <a className='flex items-center space-x-1 w-full'>
            <span className='w-1/2 truncate'>{collection.name}</span>
          </a>
        </Link>

        <div>
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
          onDelete={handleDeleteCollection}
        />
      )}
    </>
  );
};

export default SidebarCollection;
