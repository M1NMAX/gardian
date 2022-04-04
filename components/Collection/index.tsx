import { MenuAlt2Icon, PencilIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { CollectionProps } from '../../interfaces';
import ActionIcon from '../ActionIcon';
import NewCustomItemModal from '../NewCustomItemModal';
import NewEventModal from '../NewEventModal';
import NewDocumentModal from '../NewDocumentModal';
import NewTodoModal from '../NewTodoModal';
import NewCollectionModal from '../NewCollectionModal';
import CustomItems from '../CustomItems';
import Events from '../Events';
import Documents from '../Documents';
import Todos from '../Todos';
import SubCollections from '../SubCollections';
import EditCustomCollectionModal from '../EditCustomCollectionModal';
import CollectionMenu from '../CollectionMenu';
import useModal from '../../hooks/useModal';
import { deleteCollection, renameCollection } from '../../fetch/collections';
import { useRouter } from 'next/router';
import RenameModal from '../RenameModal';
import DeleteModal from '../DeleteModal';
import EditCollectionModal from '../EditCollectionModal';


const Collection: FC<CollectionProps> = ({ collection, isForSub = false }) => {
  const router = useRouter();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Feedback 
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error("Something went wrong, try later");


  let handleNewClick = (): void => { };
  let handleEditClick = (): void => { };
  let ItemsComponent = (): JSX.Element => (<> </>);

  // New Custom Item Modal
  const [newCustomItemModal, setNewCustomItemModal] = useState(false);
  const closeNewCustomItemModal = () => (setNewCustomItemModal(false));
  const openNewCustomItemModal = () => (setNewCustomItemModal(true));

  // Edit Custom Collection Modal
  const [editCustomCollectionModal, setEditCustomCollectionModal] = useState(false);
  const closeEditCustomCollectionModal = () => (setEditCustomCollectionModal(false));
  const openEditCustomCollectionModal = () => (setEditCustomCollectionModal(true));

  // New Event Modal
  const [newEventModal, setNewEventModal] = useState(false);
  const closeNewEventModal = () => (setNewEventModal(false));
  const openNewEventModal = () => (setNewEventModal(true));

  // New Document Modal
  const [newDocumentModal, setNewDocumentModal] = useState(false);
  const closeNewDocumentModal = () => (setNewDocumentModal(false));
  const openNewDocumentModal = () => (setNewDocumentModal(true));

  // New ToDo Modal
  const [newTodoModal, setNewTodoModal] = useState(false);
  const closeNewTodoModal = () => (setNewTodoModal(false));
  const openNewTodoModal = () => (setNewTodoModal(true));

  // New SubCollection Modal
  const [newCollectionModal, setSubCollectionModal] = useState(false);
  const closeNewCollectionModal = () => (setSubCollectionModal(false));
  const openNewCollectionModal = () => (setSubCollectionModal(true));



  //Edit Collection Modal
  const {
    isOpen: editCollectionModal,
    openModal: openEditCollectionModal,
    closeModal: closeEditCollectionModal } = useModal();

  //Rename Collection Modal
  const {
    isOpen: renameModal,
    openModal: openRenameModal,
    closeModal: closeRenameModal } = useModal();
  //Delete Collection Modal
  const {
    isOpen: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal } = useModal();

  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!collection._id) return;
    try {
      renameCollection(collection._id.toString(), name);
      closeRenameModal();
      positiveFeedback("Collection renamed successfully");
    } catch (error) {
      negativeFeedback()
    }
  }

  //Rename Collection fuction
  const handleDeleteCollection = () => {
    if (!collection._id) return;
    try {
      deleteCollection(collection._id.toString());
      closeDeleteModal();
      positiveFeedback("Collection deleted successfully");
      //Redirect user to collection overview 
      router.push('/collections');
    } catch (error) {
      negativeFeedback();
    }
  }



  switch (collection.variant) {
    case 'custom':
      handleNewClick = openNewCustomItemModal;
      handleEditClick = openEditCustomCollectionModal;
      ItemsComponent = CustomItems;
      break;
    case 'event':
      handleNewClick = openNewEventModal;
      handleEditClick = openEditCollectionModal;
      ItemsComponent = Events;
      break;
    case 'document':
      handleNewClick = openNewDocumentModal;
      handleEditClick = openEditCollectionModal;
      ItemsComponent = Documents;
      break;
    case 'todo':
      handleNewClick = openNewTodoModal;
      handleEditClick = openEditCollectionModal;
      ItemsComponent = Todos;
      break;
    case 'collection':
      handleNewClick = openNewCollectionModal;
      handleEditClick = openEditCollectionModal;
      ItemsComponent = SubCollections;
      break;
  }

  return (
    <>
      <div className='flex justify-between items-center'>

        <div className='flex items-center space-x-2'>
          {!sidebar && <ActionIcon icon={<MenuAlt2Icon />} variant="secondary" onClick={() => setSidebar(true)} />}
          <h1 className='space-x-0.5 text-xl'>
            {isForSub ?
              <>
                <span>
                  <Link href='/collections'>
                    <a className='hover:text-primary-bright '>
                      Collections
                    </a>
                  </Link>
                </span>
                <span>/fgnago/</span>
                <span className='font-medium'>
                  {collection.name}
                </span>
              </> :
              <>
                <span>
                  <Link href='/collections'>
                    <a className='hover:text-primary-bright '>
                      Collections
                    </a>
                  </Link>
                </span>
                <span>/</span>
                <span className='font-medium'>
                  {collection.name}
                </span>
              </>}

          </h1>
        </div>
        <div className='flex items-center space-x-1'>
          <button onClick={handleNewClick}
            className='btn btn-primary'>New</button>
          <ActionIcon icon={<PencilIcon />} variant="primary" onClick={handleEditClick} />
          <CollectionMenu variant="primary"
            onClickRename={openRenameModal}
            onClickDelete={openDeleteModal} />
        </div>
      </div>

      <div className='h-full'>
        <ItemsComponent />
      </div>
      <Toaster />

      {newCustomItemModal && <NewCustomItemModal open={newCustomItemModal} handleClose={closeNewCustomItemModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {editCustomCollectionModal && <EditCustomCollectionModal open={editCustomCollectionModal}
        handleClose={closeEditCustomCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {newEventModal && <NewEventModal open={newEventModal} handleClose={closeNewEventModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newDocumentModal && <NewDocumentModal open={newDocumentModal} handleClose={closeNewDocumentModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newTodoModal && <NewTodoModal open={newTodoModal} handleClose={closeNewTodoModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newCollectionModal && collection._id && <NewCollectionModal open={newCollectionModal}
        isSub={true} collectionId={collection._id?.toString()}
        handleClose={closeNewCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {editCollectionModal && <EditCollectionModal collection={collection} open={editCollectionModal}
        handleClose={closeEditCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {renameModal && <RenameModal open={renameModal} handleClose={closeRenameModal}
        name={collection.name} onRename={handleRenameCollection} />}

      {deleteModal && <DeleteModal open={deleteModal} handleClose={closeDeleteModal}
        name={collection.name} onDelete={handleDeleteCollection} />}
    </>
  )
}

export default Collection