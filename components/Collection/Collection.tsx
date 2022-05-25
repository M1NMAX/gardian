import { MenuAlt2Icon, PencilIcon } from '@heroicons/react/outline';
import React, { FC, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { ICollection } from '../../interfaces';
import ActionIcon from '../Frontstate/ActionIcon';
import CollectionMenu from '../CollectionMenu';
import useModal from '../../hooks/useModal';
import { deleteCollection, renameCollection } from '../../fetch/collections';
import { useRouter } from 'next/router';
import RenameModal from '../RenameModal';
import DeleteModal from '../DeleteModal';
import EditCollectionModal from './components/EditCollectionModal';

interface HeaderProps {
  children: JSX.Element;
  collection: ICollection;
}

interface DescriptionProps {
  children: string;
  hidden?: boolean;
}

interface BodyProps {
  children: ReactNode;
}
interface CollectionProps {
  children: JSX.Element[];
}

type CollectionComponent = FC<CollectionProps> & { Header: FC<HeaderProps> } & {
  Description: FC<DescriptionProps>;
} & { Body: FC<BodyProps> };

const Collection: CollectionComponent = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

const Header: FC<HeaderProps> = ({ children, collection }) => {
  const router = useRouter();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  let handleNewClick = (): void => {};
  let handleEditClick = (): void => {};

  //Edit Collection Modal
  const {
    isOpen: editCollectionModal,
    openModal: openEditCollectionModal,
    closeModal: closeEditCollectionModal,
  } = useModal();

  //Rename Collection Modal
  const {
    isOpen: renameModal,
    openModal: openRenameModal,
    closeModal: closeRenameModal,
  } = useModal();
  //Delete Collection Modal
  const {
    isOpen: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  //Rename Collection fuction
  const handleRenameCollection = (name: string): void => {
    if (!collection._id) return;
    try {
      renameCollection(collection._id.toString(), name);
      closeRenameModal();
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
      closeDeleteModal();
      positiveFeedback('Collection deleted successfully');
      //Redirect user to collection overview
      router.push('/collections');
    } catch (error) {
      negativeFeedback();
    }
  };

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center space-x-2'>
        {!sidebar && (
          <ActionIcon
            icon={<MenuAlt2Icon />}
            variant='secondary'
            onClick={() => setSidebar(true)}
          />
        )}
        {children}
      </div>
      <div className='flex items-center space-x-1'>
        <button onClick={handleNewClick} className='btn btn-primary'>
          New
        </button>
        <ActionIcon
          icon={<PencilIcon />}
          variant='primary'
          onClick={handleEditClick}
        />
        <CollectionMenu
          variant='primary'
          onClickRename={openRenameModal}
          onClickDelete={openDeleteModal}
        />
      </div>
      {/* Modals  */}

      {editCollectionModal && (
        <EditCollectionModal
          collection={collection}
          open={editCollectionModal}
          handleClose={closeEditCollectionModal}
          positiveFeedback={positiveFeedback}
          negativeFeedback={negativeFeedback}
        />
      )}

      {renameModal && (
        <RenameModal
          open={renameModal}
          handleClose={closeRenameModal}
          name={collection.name}
          onRename={handleRenameCollection}
        />
      )}

      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={closeDeleteModal}
          name={collection.name}
          onDelete={handleDeleteCollection}
        />
      )}
    </div>
  );
};

const Description: FC<DescriptionProps> = (props) => {
  const { children, hidden = false } = props;
  return <p className={`${hidden && 'hidden'}`}>{children}</p>;
};

const Body: FC<BodyProps> = (props) => {
  const { children } = props;

  return <>{children}</>;
};

Collection.Header = Header;
Collection.Description = Description;
Collection.Body = Body;

export default Collection;
