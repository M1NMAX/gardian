import {
  AdjustmentsIcon,
  MenuAlt2Icon,
  StarIcon as StarIconOutline,
} from '@heroicons/react/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/solid';
import React, { FC, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { ICollection } from '../../interfaces';
import ActionIcon from '../Frontstate/ActionIcon';
import CollectionMenu from '../CollectionMenu';
import useModal from '../../hooks/useModal';
import {
  deleteCollection,
  renameCollection,
  toggleCollectionIsFavourite,
} from '../../fetch/collections';
import { useRouter } from 'next/router';
import RenameModal from '../RenameModal';
import DeleteModal from '../DeleteModal';
import { useMutation, useQueryClient } from 'react-query';
import MoveCollectionModal from '../MoveCollectionModal';

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

  const queryClient = useQueryClient();
  //handle update collection property mutation
  const toggleCollectionIsFavouriteMutation = useMutation(
    toggleCollectionIsFavourite,
    {
      onSuccess: () => {
        if (!collection._id) throw 'CollectionId is undefined';

        queryClient.invalidateQueries(['collection', collection._id]);

        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
    }
  );

  //Rename Collection Modal
  const {
    isOpen: renameModal,
    openModal: openRenameModal,
    closeModal: closeRenameModal,
  } = useModal();

  //Move Collection Modal
  const {
    isOpen: isMoveModalOpen,
    openModal: openMoveModal,
    closeModal: closeMoveModal,
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
      renameCollection(collection._id, name);
      closeRenameModal();
      positiveFeedback('Collection renamed successfully');
    } catch (error) {
      negativeFeedback();
    }
  };

  const handleMoveCollection = (id: number) => {
    if (!collection._id) return;
    try {
      console.log(id);
    } catch (error) {
      negativeFeedback();
    }
  };

  //Handle delete collection
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
    <div>
      {/* Top section  */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          {!sidebar && (
            <ActionIcon
              icon={<MenuAlt2Icon />}
              onClick={() => setSidebar(true)}
            />
          )}
        </div>
        <div className='flex items-center space-x-1'>
          <ActionIcon
            icon={
              collection.isFavourite ? (
                <StarIconFilled className='text-green-500' />
              ) : (
                <StarIconOutline />
              )
            }
            variant='filled'
            onClick={() => {
              if (!collection._id) return;
              toggleCollectionIsFavouriteMutation.mutate(collection._id);
            }}
          />
          <ActionIcon
            icon={<AdjustmentsIcon className='rotate-90' />}
            variant='filled'
          />

          <CollectionMenu
            onClickRename={openRenameModal}
            onClickMoveTo={openMoveModal}
            onClickDelete={openDeleteModal}
          />
        </div>
      </div>
      {/* Bottom section AKA collection name  */}
      <div>{children}</div>

      {/* Modals  */}

      {renameModal && (
        <RenameModal
          open={renameModal}
          handleClose={closeRenameModal}
          name={collection.name}
          onRename={handleRenameCollection}
        />
      )}

      {isMoveModalOpen && (
        <MoveCollectionModal
          open={isMoveModalOpen}
          handleClose={closeMoveModal}
          onMove={handleMoveCollection}
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

  return <div>{children}</div>;
};

Collection.Header = Header;
Collection.Description = Description;
Collection.Body = Body;

export default Collection;
