import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CollectionMenu from '../../../CollectionMenu';
import toast from 'react-hot-toast';
import {
  deleteCollection,
  renameCollection,
} from '../../../../fetch/collections';
import RenameModal from '../../../RenameModal';
import DeleteModal from '../../../DeleteModal';
import useModal from '../../../../hooks/useModal';
import { ReplyIcon } from '@heroicons/react/outline';
import CollectionIcon from '../../../CollectionIcon';

interface SidebarCollectionProps {
  name: string;
  id?: number;
}

const SidebarCollection: FC<SidebarCollectionProps> = (props) => {
  const { id, name } = props;

  const router = useRouter();
  const { id: urlId } = router.query;

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  const renameCollectionModal = useModal();
  const deleteCollectionModal = useModal();

  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!id) return;
    try {
      renameCollection(id.toString(), name);
      renameCollectionModal.closeModal();
      positiveFeedback('Collection renamed successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  //Rename Collection fuction
  const handleDeleteCollection = () => {
    if (!id) return;
    try {
      deleteCollection(id.toString());
      deleteCollectionModal.closeModal();
      positiveFeedback('Collection deleted successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  return (
    <div className='relative'>
      <div
        className={`${id === urlId && 'border-r-2 border-primary-bright bg-gray-300 dark:bg-gray-600 '} 
        flex items-center justify-between w-full h-8 px-2 mb-1
       hover:bg-gray-400 dark:hover:bg-gray-500 space-x-1 
        font-semibold `}>
        <Link href={`/collections/${id}`}>
          <a className='flex items-center space-x-1 w-full'>
            <span className='w-1/2 truncate'>{name}</span>
          </a>
        </Link>

        <div className='absolute top-0 right-0'>
          <CollectionMenu
            onClickRename={renameCollectionModal.openModal}
            onClickDelete={deleteCollectionModal.openModal}
          />
        </div>
      </div>

      {renameCollectionModal.isOpen && (
        <RenameModal
          open={renameCollectionModal.isOpen}
          handleClose={renameCollectionModal.closeModal}
          name={name}
          onRename={handleRenameCollection}
        />
      )}

      {deleteCollectionModal.isOpen && (
        <DeleteModal
          open={deleteCollectionModal.isOpen}
          handleClose={deleteCollectionModal.closeModal}
          name={name}
          onDelete={handleDeleteCollection}
        />
      )}
    </div>
  );
};

export default SidebarCollection;
