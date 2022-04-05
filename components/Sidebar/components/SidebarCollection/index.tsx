import React, { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CollectionMenu from '../../../CollectionMenu';
import toast from 'react-hot-toast';
import { deleteCollection, renameCollection } from '../../../../fetch/collections';
import RenameModal from '../../../RenameModal';
import DeleteModal from '../../../DeleteModal';
import useModal from '../../../../hooks/useModal';


interface SidebarCollectionProps {
  name: string,
  variant: string
  id?: number,
}

const SidebarCollection: FC<SidebarCollectionProps> = ({ id, name, variant }) => {
  const router = useRouter();
  const { id: urlId } = router.query;


  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.success("Something went wrong, try later");


  const renameCollectionModal = useModal();
  const deleteCollectionModal = useModal();


  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!id) return;
    try {
      renameCollection(id.toString(), name);
      renameCollectionModal.closeModal();
      positiveFeedback("Collection renamed successfully");
    } catch (error) {
      negativeFeedback()
    }
  }

  //Rename Collection fuction
  const handleDeleteCollection = () => {
    if (!id) return;
    try {
      deleteCollection(id.toString());
      deleteCollectionModal.closeModal();
      positiveFeedback("Collection deleted successfully");
    } catch (error) {
      negativeFeedback();
    }
  }

  return (
    <div className='pl-1 pr-2.5'>
      <div className={`${id === urlId && 'border-l-4 border-green-400 text-green-400 '} 
        flex items-center justify-between w-full  px-1.5 py-1
       hover:bg-gray-300 dark:hover:bg-gray-600 space-x-1 
        font-semibold  rounded-sm group `}>

        <Link href={`/collections/${id}`}>
          <a className='flex flex-col justify-center grow truncate'>
            <span>
              {name}
            </span>
            <span className='text-xs font-light'> {variant}s</span>
          </a>
        </Link>

        <div className='md:invisible md:group-hover:visible '>
          <CollectionMenu onClickRename={renameCollectionModal.openModal}
            onClickDelete={deleteCollectionModal.openModal} />
        </div>
      </div>

      {renameCollectionModal.isOpen && <RenameModal open={renameCollectionModal.isOpen}
        handleClose={renameCollectionModal.closeModal}
        name={name} onRename={handleRenameCollection} />}

      {deleteCollectionModal.isOpen && <DeleteModal open={deleteCollectionModal.isOpen}
        handleClose={deleteCollectionModal.closeModal}
        name={name} onDelete={handleDeleteCollection} />}
    </div>
  )
}

export default SidebarCollection