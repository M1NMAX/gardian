import Link from 'next/link';
import React, { FC } from 'react';
import toast from 'react-hot-toast';
import { deleteCollection, renameCollection } from '../../fetch/collections';
import useModal from '../../hooks/useModal';
import { ICollection } from '../../interfaces';
import CollectionMenu from '../CollectionMenu';
import DeleteModal from '../DeleteModal';
import RenameModal from '../RenameModal';

interface CollectionOverviewProps {
  collection: ICollection;
}

const CollectionOverview: FC<CollectionOverviewProps> = (props) => {
  const { collection } = props;

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () =>
    toast.success('Something went wrong, try later');

  const renameCollectionModal = useModal();
  const deleteCollectionModal = useModal();

  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!collection._id) return;
    try {
      renameCollection(collection._id.toString(), name);
      renameCollectionModal.closeModal();
      positiveFeedback('Collection renamed successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  //Rename Collection fuction
  const handleDeleteCollection = () => {
    if (!collection._id) return;
    try {
      deleteCollection(collection._id.toString());
      deleteCollectionModal.closeModal();
      positiveFeedback('Collection deleted successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  return (
    <div className='flex justify-between p-1 text-xl rounded shadow-md bg-gray-100 dark:bg-gray-800 group'>
      <Link href={`/collections/${collection._id}`}>
        <a className=' flex flex-col font-semibold text-lg'>
          {collection.name}

          
          <span className='text-xs font-light italic'>
            {collection.updatedAt
              ? new Date(collection.updatedAt).toDateString()
              : 'Loading'}
          </span>
        </a>
      </Link>
      <div className='md:invisible md:group-hover:visible '>
        <CollectionMenu
          onClickRename={renameCollectionModal.openModal}
          onClickDelete={deleteCollectionModal.openModal}
        />
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
    </div>
  );
};

export default CollectionOverview;
