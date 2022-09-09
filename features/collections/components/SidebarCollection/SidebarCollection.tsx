import { useRouter } from 'next/router';
import React, { FC } from 'react';
import toast from 'react-hot-toast';
import DeleteModal from '@components/DeleteModal';
import RenameModal from '@components/RenameModal';
import { Icon, IconPickerModal } from '@features/Icons';
import { FolderIcon } from '@heroicons/react/24/solid';
import useModal from '@hooks/useModal';
import { Icon as IconModel } from '@prisma/client';
import useCollection from '../../hooks/useCollection';
import MoveCollectionModal from '../MoveCollectionModal';
import SidebarCollectionMenu from '../SidebarCollectionMenu';


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
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  //Modals
  const deleteCollectionModal = useModal();
  const renameCollectionModal = useModal();
  const moveCollectionModal = useModal();
  const changeCollectionIconModal = useModal();

  //Fetch collection
  const collection = useCollection(collectionId, 'sidebarCollection');
  const collectionData = collection.query.data;
  const isLoading = collection.query.isLoading;

  //handle change collection icon and its mutation
  const handleChangeCollectionIcon = (icon: IconModel) => {
    console.log(icon);
    collection.changeCollectionIconMutateFun(icon, {
      onSuccess: () => {
        positiveFeedback('Icon changed');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        changeCollectionIconModal.closeModal();
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
      onSettled: () => {
        renameCollectionModal.closeModal();
      },
    });
  };

  //handle delete collection and its mutation
  const handleDeleteCollection = () => {
    collection.deleteCollectionMutateFun(collectionId, {
      onSuccess: () => {
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
  const handleDuplicateCollection = () => {
    if (!collectionData) return;
    const {
      name,
      icon,
      description,
      properties,
      isDescriptionHidden,
      isFavourite,
      groupId,
    } = collectionData;

    collection.duplicateCollectionMutateFun(
      {
        name: name + '(copy)',
        icon,
        description,
        properties,
        isDescriptionHidden,
        isFavourite,
        groupId,
      },
      {
        onSuccess: () => {
          positiveFeedback('Collection duplicated');
        },
        onError: () => {
          negativeFeedback();
        },
      }
    );
  };

  //handle move collection to another group and its mutation
  const handleMoveCollection = (desGroupId: string) => {
    collection.moveCollectionMutateFun(desGroupId, {
      onSuccess: () => {
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    });
  };

  if (isLoading)
    return (
      <div className=' p-1  animate-pulse rounded bg-gray-100 dark:bg-gray-800'>
        <div className='w-full h-6  rounded bg-gray-300 dark:bg-gray-600'></div>
      </div>
    );
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
        <button
          className='grow flex items-center space-x-1.5'
          onClick={onClick}>
          <Icon icon={collectionData.icon} defaultIcon={<FolderIcon />} />
          <span className='truncate'>{collectionData.name}</span>
        </button>

        {collectionData._count.items !== 0 && (
          <span className='flex items-center  md:group-hover:hidden md:group-focus-within:hidden'>
            <span className='text-xs font-light italic'>
              {collectionData._count.items}
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
            onClickChangeIcon={changeCollectionIconModal.openModal}
            onClickMove={moveCollectionModal.openModal}
          />
        </div>
      </div>

      {changeCollectionIconModal.isOpen && (
        <IconPickerModal
          open={changeCollectionIconModal.isOpen}
          handleClose={changeCollectionIconModal.closeModal}
          onClickIcon={handleChangeCollectionIcon}
        />
      )}

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

export default SidebarCollection;
