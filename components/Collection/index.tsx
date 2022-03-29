import { MenuAlt2Icon, PencilIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { CollectionProps } from '../../interfaces';
import IconBtn from '../IconBtn';
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


const Collection: FC<CollectionProps> = ({ collection }) => {
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



  switch (collection.variant) {
    case 'custom':
      handleNewClick = openNewCustomItemModal;
      handleEditClick = openEditCustomCollectionModal;
      ItemsComponent = CustomItems;
      break;
    case 'event':
      handleNewClick = openNewEventModal;
      ItemsComponent = Events;
      break;
    case 'document':
      handleNewClick = openNewDocumentModal;
      ItemsComponent = Documents;
      break;
    case 'todo':
      handleNewClick = openNewTodoModal;
      ItemsComponent = Todos;
      break;
    case 'collection':
      handleNewClick = openNewCollectionModal;
      ItemsComponent = SubCollections;
      break;
  }

  return (
    <>
      <div className='flex justify-between items-center'>

        <div className='flex items-center space-x-2'>
          {!sidebar && <IconBtn icon={<MenuAlt2Icon />} variant="secondary" onClick={() => setSidebar(true)} />}
          <h1 className='space-x-0.5 text-xl'>
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
          </h1>
        </div>
        <div className='flex items-center space-x-1'>
          <button onClick={handleNewClick}
            className='btn btn-primary'>New</button>
          <IconBtn icon={<PencilIcon />} variant="primary" onClick={handleEditClick} />
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

    </>
  )
}

export default Collection