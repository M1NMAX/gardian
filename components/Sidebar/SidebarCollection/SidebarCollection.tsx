import React, { FC } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  addItemToCollection,
  createCollection,
} from '../../../services/collections';
import RenameModal from '../../RenameModal';
import DeleteModal from '../../DeleteModal';
import useModal from '../../../hooks/useModal';
import SidebarCollectionMenu from '../SidebarCollectionMenu';
import { useMutation, useQueryClient } from 'react-query';
import {
  addCollectionToGroup,
  removeCollectionFromGroup,
} from '../../../services/group';
import { createItem, getItem } from '../../../services/item';
import {
  MoveCollectionModal,
  useCollection,
} from '../../../features/collections';

interface SidebarCollectionProps {
  collectionId: string;
  groupId: string;
  onClick: () => void;
}

const SidebarCollection: FC<SidebarCollectionProps> = (props) => {
  const { collectionId, groupId, onClick } = props;

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

  //Fetch collection
  const collection = useCollection(collectionId, 'sidebarCollection');
  const collectionData = collection.query.data;

  //handle rename collection and its mutation
  const handleRenameCollection = (name: string) => {
    collection.renameCollectionMutateFun(name, {
      onSuccess: () => {
        positiveFeedback('Collection renamed');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        renameCollectionModal.closeModal();
      },
    });
  };

  //handle delete collection and its mutation
  const handleDeleteCollection = () => {
    collection.deleteCollectionMutateFun(collectionId, {
      onSuccess: async () => {
        await removeCollectionFromGroup(groupId, collectionId);
        positiveFeedback('Collection deleted');
        if (collectionId === urlId) router.push('/collections');
      },
      onError: () => {
        negativeFeedback();
      },
    });
  };

  //handle toggle collection favourite state and its mutation
  const handleCollectionIsFavState = () => {
    collection.toggleIsFavStateMutateFun(collectionId, {
      onSuccess: () => {
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    });
  };

  //handle collection duplication and its mutation
  const { mutate: duplicateCollectionMutateFun } = useMutation(
    createCollection,
    {
      onSuccess: async ({ _id: duplicatedCid }) => {
        if (!duplicatedCid) throw 'Duplicated collection id is undefined';
        if (!collectionData) throw 'Collection is undefined';
        await addCollectionToGroup(groupId, duplicatedCid);

        //duplicate all collection item
        collectionData.items.map(async (itemId) => {
          const { name, properties } = await getItem(itemId);
          const { _id: newItemId } = await createItem({ name, properties });

          if (!newItemId) return 'New item id is undefined';
          await addItemToCollection(duplicatedCid, newItemId);
        });

        queryClient.invalidateQueries(['groups']);
        queryClient.invalidateQueries(['collections']);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  const handleDuplicateCollection = () => {
    if (!collectionData) return;
    const { name, description, properties, isDescriptionHidden, isFavourite } =
      collectionData;

    duplicateCollectionMutateFun({
      name: name + '(copy)',
      description,
      properties,
      isDescriptionHidden,
      isFavourite,
      items: [],
    });
  };

  //handle move collection to another group and its mutation
  const { mutate: moveCollectionMutateFun } = useMutation(
    async (desGroupId: string) => {
      await removeCollectionFromGroup(groupId, collectionId);
      await addCollectionToGroup(desGroupId, collectionId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groups']);
        queryClient.invalidateQueries(['collections']);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  const handleMoveCollection = (desGroupId: string) => {
    moveCollectionMutateFun(desGroupId);
  };

  if (!collectionData) return <></>;
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
          <span className='truncate'>{collectionData.name}</span>
        </button>

        {collectionData.items.length !== 0 && (
          <span className='flex items-center  md:group-hover:hidden md:group-focus-within:hidden'>
            <span className='text-xs font-light italic'>
              {collectionData.items.length}
            </span>
          </span>
        )}

        <div className='block md:hidden md:group-hover:block md:group-focus-within:block'>
          <SidebarCollectionMenu
            isFavourite={collectionData.isFavourite}
            onClickDelete={deleteCollectionModal.openModal}
            onClickAddToFavourite={handleCollectionIsFavState}
            onClickDuplicate={handleDuplicateCollection}
            onClickRename={renameCollectionModal.openModal}
            onClickMove={moveCollectionModal.openModal}
          />
        </div>
      </div>

      {renameCollectionModal.isOpen && (
        <RenameModal
          open={renameCollectionModal.isOpen}
          handleClose={renameCollectionModal.closeModal}
          name={collectionData.name}
          onRename={handleRenameCollection}
        />
      )}

      {moveCollectionModal.isOpen && (
        <MoveCollectionModal
          currentGroupId={groupId}
          open={moveCollectionModal.isOpen}
          handleClose={moveCollectionModal.closeModal}
          onMove={handleMoveCollection}
        />
      )}

      {deleteCollectionModal.isOpen && (
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

export default SidebarCollection;
