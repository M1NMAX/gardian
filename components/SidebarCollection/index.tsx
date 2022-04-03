import React, { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CollectionMenu from '../CollectionMenu';
import toast from 'react-hot-toast';
import { deleteCollection, renameCollection } from '../../fetch/collections';
import RenameModal from '../RenameModal';
import DeleteModal from '../DeleteModal';


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


  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!id) return;
    try {
      renameCollection(id.toString(), name);
      closeRenameCollectionModal();
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
      closeDeleteCollectionModal();
      positiveFeedback("Collection deleted successfully");
      //Redirect user to collection overview page if user delete current url collection
      if (id.toString() === urlId) router.push('/collections');
    } catch (error) {
      negativeFeedback();
    }
  }

  //Delete Item Modal
  const [deleteCollectionModal, setDeleteCollectionModal] = useState(false);
  const openDeleteCollectionModal = () => setDeleteCollectionModal(true);
  const closeDeleteCollectionModal = () => setDeleteCollectionModal(false);

  //Rename Item Modal
  const [renameCollectionModal, setRenameCollectionModal] = useState(false);
  const openRenameCollectionModal = () => setRenameCollectionModal(true);
  const closeRenameCollectionModal = () => setRenameCollectionModal(false);


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
          <CollectionMenu onClickRename={openRenameCollectionModal}
            onClickDelete={openDeleteCollectionModal} />
        </div>
      </div>

      {renameCollectionModal && <RenameModal open={renameCollectionModal} handleClose={closeRenameCollectionModal}
        name={name} onRename={handleRenameCollection} />}

      {deleteCollectionModal && <DeleteModal open={deleteCollectionModal} handleClose={closeDeleteCollectionModal}
        name={name} onDelete={handleDeleteCollection} />}
    </div>
  )
}

export default SidebarCollection