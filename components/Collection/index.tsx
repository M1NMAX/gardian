import { MenuAlt2Icon, PencilIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { CollectionInterface } from '../../interfaces';
import ActionIcon from '../ActionIcon';
import NewCustomItemModal from './components/CustomCollection/NewCustomItemModal';
import NewEventModal from './components/Events/NewEventModal';
import NewDocumentModal from './components/Documents/NewDocumentModal';
import NewTodoModal from './components/Todos/NewTodoModal';
import NewCollectionModal from '../NewCollectionModal';
import CustomCollection from './components/CustomCollection';
import Events from './components/Events';
import Documents from './components/Documents';
import Todos from './components/Todos';
import SubCollections from './components/SubCollections';
import EditCustomCollectionModal from './components/CustomCollection/EditCustomCollectionModal';
import CollectionMenu from '../CollectionMenu';
import useModal from '../../hooks/useModal';
import { deleteCollection, renameCollection } from '../../fetch/collections';
import { useRouter } from 'next/router';
import RenameModal from '../RenameModal';
import DeleteModal from '../DeleteModal';
import EditCollectionModal from './components/EditCollectionModal';



interface HeaderProps {
  children: JSX.Element
  collection: CollectionInterface
}

interface TitleProps {
  children: string
}

interface DescriptionProps {
  children: string
  hidden: boolean
}

interface BodyProps {
  children?: JSX.Element
  variant: string
}
interface CollectionProps {
  children: JSX.Element[]
}

type CollectionComponent = FC<CollectionProps>
  & { Header: FC<HeaderProps> }
  & { Title: FC<TitleProps> }
  & { Description: FC<DescriptionProps> }
  & { Body: FC<BodyProps> }


const Collection: CollectionComponent = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}



const Header: FC<HeaderProps> = ({ children, collection }) => {
  const router = useRouter();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Feedback 
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error("Something went wrong, try later");

  let handleNewClick = (): void => { };
  let handleEditClick = (): void => { };

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
      break;
    case 'event':
      handleNewClick = openNewEventModal;
      handleEditClick = openEditCollectionModal;

      break;
    case 'document':
      handleNewClick = openNewDocumentModal;
      handleEditClick = openEditCollectionModal;
      break;
    case 'todo':
      handleNewClick = openNewTodoModal;
      handleEditClick = openEditCollectionModal;
      break;
    case 'collection':
      handleNewClick = openNewCollectionModal;
      handleEditClick = openEditCollectionModal;
      break;
  }
  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center space-x-2'>
        {!sidebar && <ActionIcon icon={<MenuAlt2Icon />} variant="secondary" onClick={() => setSidebar(true)} />}
        {children}
      </div>
      <div className='flex items-center space-x-1'>
        <button onClick={handleNewClick}
          className='btn btn-primary'>New</button>
        <ActionIcon icon={<PencilIcon />} variant="primary" onClick={handleEditClick} />
        <CollectionMenu variant="primary"
          onClickRename={openRenameModal}
          onClickDelete={openDeleteModal} />
      </div>
      {/* Modals  */}

      {newCustomItemModal && <NewCustomItemModal
        collection={collection}
        open={newCustomItemModal}
        handleClose={closeNewCustomItemModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newEventModal && <NewEventModal open={newEventModal} handleClose={closeNewEventModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newDocumentModal && <NewDocumentModal open={newDocumentModal} handleClose={closeNewDocumentModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newTodoModal && <NewTodoModal open={newTodoModal} handleClose={closeNewTodoModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newCollectionModal && collection._id && <NewCollectionModal open={newCollectionModal}
        isSub parentName={collection.name} collectionId={collection._id?.toString()}
        handleClose={closeNewCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {editCustomCollectionModal && <EditCustomCollectionModal collection={collection}
        open={editCustomCollectionModal}
        handleClose={closeEditCustomCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {editCollectionModal && <EditCollectionModal collection={collection} open={editCollectionModal}
        handleClose={closeEditCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {renameModal && <RenameModal open={renameModal} handleClose={closeRenameModal}
        name={collection.name} onRename={handleRenameCollection} />}

      {deleteModal && <DeleteModal open={deleteModal} handleClose={closeDeleteModal}
        name={collection.name} onDelete={handleDeleteCollection} />}
    </div>
  )
}

const Title: FC<TitleProps> = ({ children }) => {
  return (
    <h2 className='font-semibold text-2xl'>
      {children}
    </h2>
  )
}

const Description: FC<DescriptionProps> = ({ children, hidden }) => {
  return (
    <p className={`${hidden && 'hidden'}`}>
      {children}
    </p>
  )
}

const Body: FC<BodyProps> = ({ variant }) => {
  let ItemsComponent = (): JSX.Element => (<> </>);

  switch (variant) {
    case 'custom':
      ItemsComponent = CustomCollection;
      break;
    case 'event':
      ItemsComponent = Events;
      break;
    case 'document':
      ItemsComponent = Documents;
      break;
    case 'todo':
      ItemsComponent = Todos;
      break;
    case 'collection':
      ItemsComponent = SubCollections;
      break;
  }
  return (
    <ItemsComponent />
  )
}


Collection.Header = Header;
Collection.Title = Title;
Collection.Description = Description;
Collection.Body = Body;

export default Collection