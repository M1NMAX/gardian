import {
  InformationCircleIcon,
  MenuAlt2Icon,
  StarIcon as StarIconOutline,
} from '@heroicons/react/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/solid';
import React, { FC, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../../../atoms/sidebarAtom';
import { ICollection } from '../../../../interfaces';
import { ActionIcon } from '../../../../components/frontstate-ui';
import CollectionMenu from '../CollectionMenu';
import useModal from '../../../../hooks/useModal';
import {
  deleteCollection,
  renameCollection,
  toggleCollectionDescriptionState,
  toggleCollectionIsFavourite,
} from '../../../../fetch/collections';
import { useRouter } from 'next/router';
import RenameModal from '../../../../components/RenameModal';
import DeleteModal from '../../../../components/DeleteModal';
import { useMutation, useQueryClient } from 'react-query';

interface HeaderProps {
  children: ReactNode;
  collection: ICollection;
  openNewItemModal: () => void;
}

interface DescriptionProps {
  children: ReactNode;
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
    <div
      className='h-full overflow-y-scroll scrollbar-thin 
      scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
      {children}
      <Toaster />
    </div>
  );
};

const Header: FC<HeaderProps> = (props) => {
  const { children, collection, openNewItemModal } = props;

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

  const handleDescriptionState = () => {
    if (!collection._id) return;
    toggleCollectionDescriptionMutation.mutate(collection._id);
  };
  //handle toggle collection description state mutation
  const toggleCollectionDescriptionMutation = useMutation(
    toggleCollectionDescriptionState,
    {
      onSuccess: () => {
        if (!collection._id) throw 'CollectionId is undefined';

        queryClient.invalidateQueries(['collection', collection._id]);
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

  //Delete Collection Modal
  const {
    isOpen: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  //handle rename collection and its mutation
  const renameCollectionMutation = useMutation(
    async (name: string) => {
      if (!collection._id) return;
      await renameCollection(collection._id.toString(), name);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sidebarCollection', collection._id]);
        queryClient.invalidateQueries(['collection', collection._id]);
        positiveFeedback('Success');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        closeRenameModal();
      },
    }
  );

  //handle delete collection and its mutation
  const deleteCollectionMutation = useMutation(
    async () => {
      if (!collection._id) return;
      await deleteCollection(collection._id.toString());
    },
    {
      onSuccess: () => {
        if (!collection._id) return;

        queryClient.removeQueries(['sidebarCollection', collection._id]);
        queryClient.removeQueries(['collection', collection._id]);

        positiveFeedback('Collection deleted');
        //send user to My Collection page after delete
        router.push('/collections');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        closeDeleteModal();
      },
    }
  );

  return (
    <div className='sticky top-0 px-4 py-2 dark:bg-gray-900'>
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
        {/* Middle AKA collection name  */}
        <div
          className='group flex items-center justify-between space-x-2 
            first:grow first:truncate '>
          {children}
          {/* only render the follow btn if colllection does not have description */}
          {collection.description === '' && collection.isDescriptionHidden && (
            <button
              onClick={handleDescriptionState}
              className='flex items-center px-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 
              invisible group-hover:visible'>
              <InformationCircleIcon className='icon-xs' />
              <span>Add Description </span>
            </button>
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

          <CollectionMenu
            isDescriptionHidden={collection.isDescriptionHidden}
            onClickNewItem={openNewItemModal}
            onClickDesctiption={handleDescriptionState}
            onClickRename={openRenameModal}
            onClickDelete={openDeleteModal}
          />
        </div>
      </div>

      {/* Modals  */}

      {renameModal && (
        <RenameModal
          open={renameModal}
          handleClose={closeRenameModal}
          name={collection.name}
          onRename={renameCollectionMutation.mutate}
        />
      )}

      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={closeDeleteModal}
          name={collection.name}
          onDelete={deleteCollectionMutation.mutate}
        />
      )}
    </div>
  );
};

const Description: FC<DescriptionProps> = (props) => {
  const { children, hidden = false } = props;
  return <div className={`${hidden && 'hidden'} px-4`}>{children}</div>;
};

const Body: FC<BodyProps> = (props) => {
  const { children } = props;

  return <div className='px-4'>{children}</div>;
};

Collection.Header = Header;
Collection.Description = Description;
Collection.Body = Body;

export default Collection;
