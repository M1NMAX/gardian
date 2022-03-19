import { MenuAlt2Icon, PencilIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { CollectionProps } from '../../interfaces';
import IconBtn from '../IconBtn';
import NewSimpleItemModal from '../NewSimpleItemModal';
import NewEventModal from '../NewEventModal';
import NewDocumentModal from '../NewDocumentModal';
import NewToDoModal from '../NewToDoModal';
import NewSubCollectionModal from '../NewSubCollectionModal';
import Documents from '../Documents';
import Todos from '../Todos';


const Collection: FC<CollectionProps> = ({ collection }) => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Feedback 
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error("Something went wrong, try later");


  let handleNewClick = (): void => { };
  let handleEditClick = () => null;
  let ItemsComponent = (): JSX.Element => (<> </>);

  // New Simple Item Modal
  const [newSimpleItemModal, setSimpleItemModal] = useState(false);
  const closeNewSimpleItemModal = () => (setSimpleItemModal(false));
  const openNewSimpleItemModal = () => (setSimpleItemModal(true));

  // New Event Modal
  const [newEventModal, setNewEventModal] = useState(false);
  const closeNewEventModal = () => (setNewEventModal(false));
  const openNewEventModal = () => (setNewEventModal(true));

  // New Document Modal
  const [newDocumentModal, setNewDocumentModal] = useState(false);
  const closeNewDocumentModal = () => (setNewDocumentModal(false));
  const openNewDocumentModal = () => (setNewDocumentModal(true));

  // New ToDo Modal
  const [newToDoModal, setNewToDoModal] = useState(false);
  const closeNewToDoModal = () => (setNewToDoModal(false));
  const openNewToDoModal = () => (setNewToDoModal(true));

  // New SubCollection Modal
  const [newSubCollectionModal, setNewSubCollectionModal] = useState(false);
  const closeNewSubCollectionModal = () => (setNewSubCollectionModal(false));
  const openNewSubCollectionModal = () => (setNewSubCollectionModal(true));



  switch (collection.variant) {
    case 'simple':
      handleNewClick = openNewSimpleItemModal;
      break;
    case 'event':
      handleNewClick = openNewEventModal;
      break;
    case 'document':
      handleNewClick = openNewDocumentModal;
      ItemsComponent = Documents;
      break;
    case 'todo':
      handleNewClick = openNewToDoModal;
      ItemsComponent = Todos;
      break;
    case 'collection':
      handleNewClick = openNewSubCollectionModal;
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
          <IconBtn icon={<PencilIcon />} variant="primary" />
        </div>
      </div>

      <div className='h-full'>
        <ItemsComponent />
      </div>
      <Toaster />

      {newSimpleItemModal && <NewSimpleItemModal open={newSimpleItemModal} handleClose={closeNewSimpleItemModal} />}

      {newEventModal && <NewEventModal open={newEventModal} handleClose={closeNewEventModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newDocumentModal && <NewDocumentModal open={newDocumentModal} handleClose={closeNewDocumentModal} />}

      {newToDoModal && <NewToDoModal open={newToDoModal} handleClose={closeNewToDoModal}
        positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback} />}

      {newSubCollectionModal && <NewSubCollectionModal open={newSubCollectionModal}
        handleClose={closeNewSubCollectionModal} positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

    </>
  )
}

export default Collection