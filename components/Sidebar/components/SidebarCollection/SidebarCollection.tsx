import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  deleteCollection,
  getCollection,
  renameCollection,
} from '../../../../fetch/collections';
import RenameModal from '../../../RenameModal';
import DeleteModal from '../../../DeleteModal';
import useModal from '../../../../hooks/useModal';
import SidebarCollectionMenu from '../SidebarCollectionMenu';
import { useQuery } from 'react-query';

interface SidebarCollectionProps {
  collectionId: number;
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
  const deleteCollectionModal = useModal();

  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!collectionId) return;
    try {
      renameCollection(collectionId, name);
      renameCollectionModal.closeModal();
      positiveFeedback('Collection renamed successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  //Rename Collection fuction
  const handleDeleteCollection = () => {
    if (!collectionId) return;
    try {
      deleteCollection(collectionId.toString());
      deleteCollectionModal.closeModal();
      positiveFeedback('Collection deleted successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  if (!collection) return <></>;
  return (
    <>
      <div
        className={`
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
            onClickRename={renameCollectionModal.openModal}
            onClickDelete={deleteCollectionModal.openModal}
          />
        </div>
      </div>

      {renameCollectionModal.isOpen && (
        <RenameModal
          open={renameCollectionModal.isOpen}
          handleClose={renameCollectionModal.closeModal}
          name={collection.name}
          onRename={handleRenameCollection}
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
