import { Menu, Transition } from '@headlessui/react';
import { DotsHorizontalIcon, DotsVerticalIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import useModal from '../../hooks/useModal';
import { DocumentInterface } from '../../interfaces';
import EditDocumentModal from '../EditDocumentModal';

function Documents() {
  const router = useRouter();
  const { id: collectionId } = router.query;
  const { data } = useQuery<DocumentInterface[]>('documents', async (): Promise<DocumentInterface[]> => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/documents/collectionId/' + collectionId);
    const response = await res.json();
    return response.data;
  });



  return (
    <div>Documents

      <div className='flex flex-col space-y-1'>
        {data?.map((document, idx) => (
          <Document key={idx} document={document} />
        ))}

      </div>
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


  return (
    <div className="flex justify-between items-center space-x-2 px-2 py-1 rounded-md border group">


      <button
        onClick={editDocumentModal.openModal}
        className=" grow flex space-x-1">
        <span>

          {document.name}
        </span>
        <span>
          word count: {document.content.length}
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
              <button
                className='w-full space-x-1 btn btn-secondary'>
                <TrashIcon className='icon-sm' />
                <span> Rename </span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
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

    </div>
  )
}

export default Documents