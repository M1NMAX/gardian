import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import React, { FC, Fragment, useEffect } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { deleteDocument, renameDocument } from '../../../../fetch/documents';
import useModal from '../../../../hooks/useModal';
import { DocumentInterface } from '../../../../interfaces';
import DeleteModal from '../../../DeleteModal';
import EditDocumentModal from './EditDocumentModal';
import RenameModal from '../../../RenameModal';
import EmptyCollection from '../EmptyCollection';

function Documents() {
  const router = useRouter();
  const { id: collectionId } = router.query;
  const { data, refetch } = useQuery<DocumentInterface[]>('documents', async (): Promise<DocumentInterface[]> => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/documents/collectionId/' + collectionId);
    const response = await res.json();
    return response.data;
  });

  useEffect(() => { refetch() }, [collectionId])

  return (
    <div className='flex flex-col space-y-1'>
      {data?.length === 0 &&
        <EmptyCollection />
      }
      {data?.map((document, idx) => (
        <Document key={idx} document={document} />
      ))}

    </div>
  )
}


interface DocumentProps {
  document: DocumentInterface
}
const Document: FC<DocumentProps> = ({ document }) => {

  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.success("Something went wrong, try later");

  const editDocumentModal = useModal();
  const renameModal = useModal();
  const deleteModal = useModal();


  //Rename Collection fuction
  const handleRenameDocument = (name: string): void => {
    if (!document._id) return;
    try {
      renameDocument(document._id.toString(), name);
      renameModal.closeModal();
      positiveFeedback("Collection renamed successfully");
    } catch (error) {
      negativeFeedback()
    }
  }

  //Rename Collection fuction
  const handleDeleteDocument = () => {
    if (!document._id) return;
    try {
      deleteDocument(document._id.toString());
      deleteModal.closeModal();
      positiveFeedback("Collection deleted successfully");
    } catch (error) {
      negativeFeedback();
    }
  }


  return (
    <div className="flex justify-between items-center space-x-2 px-2 py-1 rounded-md border group">


      <button
        onClick={editDocumentModal.openModal}
        className="grow flex items-center justify-between space-x-1">
        <span className='text-lg font-semibold'>
          {document.name}
        </span>
        <span className='text-xs'>
          Last modification: &nbsp;
          {document.updatedAt ?
            new Date(document.updatedAt).toDateString() :
            'Loading'}
        </span>
      </button>

      <Menu as="div" className="relative md:invisible md:group-hover:visible" >
        <Menu.Button className="btn btn-secondary">
          <DotsVerticalIcon className='icon-sm' />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items as="ul" className="absolute  z-10 -right-2 w-fit p-1 rounded border  origin-top-right bg-white dark:bg-gray-900">
            <Menu.Item>
              <button onClick={renameModal.openModal}
                className='w-full space-x-1 btn btn-secondary'>
                <PencilIcon className='icon-sm' />
                <span> Rename </span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button onClick={deleteModal.openModal}
                className='w-full space-x-1 btn btn-secondary'>
                <TrashIcon className='icon-sm' />
                <span> Delete </span>
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      {editDocumentModal.isOpen && <EditDocumentModal
        document={document}
        open={editDocumentModal.isOpen}
        handleClose={editDocumentModal.closeModal}
        positiveFeedback={positiveFeedback}
        negativeFeedback={negativeFeedback} />}

      {renameModal.isOpen && <RenameModal open={renameModal.isOpen}
        handleClose={renameModal.closeModal}
        name={document.name} onRename={handleRenameDocument} />}

      {deleteModal.isOpen && <DeleteModal open={deleteModal.isOpen}
        handleClose={deleteModal.closeModal}
        name={document.name} onDelete={handleDeleteDocument} />}

    </div>
  )
}

export default Documents