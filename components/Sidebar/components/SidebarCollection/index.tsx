import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CollectionMenu from '../../../CollectionMenu';
import toast from 'react-hot-toast';
import { deleteCollection, renameCollection } from '../../../../fetch/collections';
import RenameModal from '../../../RenameModal';
import DeleteModal from '../../../DeleteModal';
import useModal from '../../../../hooks/useModal';
import { AdjustmentsIcon, CalendarIcon, CheckCircleIcon, CollectionIcon, DocumentIcon, ReplyIcon } from '@heroicons/react/outline';


interface SidebarCollectionProps {
  name: string,
  variant: string
  id?: number,
  isSub: boolean
}

const SidebarCollection: FC<SidebarCollectionProps> = ({ id, name, variant, isSub }) => {
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

  const handleVariantIcon = (variant: string): JSX.Element => {
    let result = <></>
    switch (variant) {
      case 'custom':
        result = <AdjustmentsIcon className='icon-xs ' />
        break;
      case 'event':
        result = <CalendarIcon className='icon-xs ' />
        break;
      case 'document':
        result = <DocumentIcon className='icon-xs ' />
        break;
      case 'todo':
        result = <CheckCircleIcon className='icon-xs ' />
        break;
      case 'collection':
        result = <CollectionIcon className='icon-xs ' />
        break;
    }
    return result;
  }


  return (
    <div className='relative'>

      <div className={`${id === urlId && 'bg-green-400'} ${isSub ? 'pl-10' : 'pl-2.5'}
        flex items-center justify-between w-full h-8 pr-1  
       hover:bg-gray-300 dark:hover:bg-gray-600 space-x-1 
        font-semibold rounded-sm `}>


        <Link href={`/collections/${id}`}>
          <a className='flex items-center space-x-1'>
            <ReplyIcon className='icon-xs -rotate-180' />
            {handleVariantIcon(variant)}
            <span className='w-1/2 truncate'>
              {name}
            </span>
          </a>
        </Link>

        <div className='absolute top-0 right-0'>
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