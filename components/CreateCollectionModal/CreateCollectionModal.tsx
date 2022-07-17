import React, { FC, useState } from 'react';
import Modal from '../Frontstate/Modal';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { RadioGroup } from '@headlessui/react';
import { IGroup } from '../../interfaces';
import { createCollection } from '../../fetch/collections';
import { CollectionIcon, LightningBoltIcon } from '@heroicons/react/outline';
import Label from '../Label';
import { addCollectionToGroup } from '../../fetch/group';
import { useMutation, useQueryClient } from 'react-query';

interface NewCollectionModalProps {
  groups: IGroup[];
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  positiveFeedback: (value: string) => void;
  negativeFeedback: () => void;
}

const NewCollectionModal: FC<NewCollectionModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback, groups } =
    props;
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]._id);

  const queryClient = useQueryClient();

  const createCollectionMutation = useMutation(
    async (name: string) => {
      if (!selectedGroup) return;

      const collection = await createCollection({
        name,
        description: '',
        isDescriptionHidden: false,
        isFavourite: false,
        properties: [],
        items: [],
      });
      if (!collection._id) throw true;
      await addCollectionToGroup(selectedGroup, collection._id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groups']);

        positiveFeedback('Collection created');
      },
      onError: () => {
        negativeFeedback();
      },
      onSettled: () => {
        handleClose();
      },
    }
  );

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    createCollectionMutation.mutate(name);
  };

  return (
    <Modal
      title={<Label icon={<CollectionIcon />} text='New collection' />}
      open={open}
      onHide={handleClose}>
      <form onSubmit={handleSubmit} className='modal-form'>
        <label>
          <span className='modal-input-label'>Name</span>
          <input
            type='text'
            name='name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder='Collection name'
            className='modal-input'
          />
        </label>

        <div className='w-full mt-2'>
          <RadioGroup value={selectedGroup} onChange={setSelectedGroup}>
            <RadioGroup.Label className='modal-input-label'>
              Group
            </RadioGroup.Label>
            <div className='space-y-1'>
              {groups.map((group, idx) => (
                <RadioGroup.Option
                  key={idx}
                  value={group._id}
                  className={({ checked }) =>
                    `${
                      checked
                        ? 'bg-primary-200  text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    } relative rounded-md shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
                  }>
                  {({ checked }) => (
                    <>
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center'>
                          <div className='text-sm'>
                            <RadioGroup.Label
                              as='p'
                              className={`font-medium  ${
                                checked
                                  ? 'text-white'
                                  : 'text-black dark:text-gray-50'
                              }`}>
                              {group.name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as='span'
                              className={`inline ${
                                checked
                                  ? 'text-white'
                                  : 'text-gray-600 dark:text-gray-50'
                              }`}>
                              <span className='mt-0.5 flex items-center space-x-0.5'>
                                <LightningBoltIcon className='w-4 h-4' />
                                <span className='text-xs font-light italic'>
                                  {group.collections.length}
                                </span>
                              </span>
                            </RadioGroup.Description>
                          </div>
                        </div>
                        {checked && (
                          <div className='flex-shrink-0 text-white'>
                            <CheckCircleIcon className='w-6 h-6' />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className='flex justify-end space-x-2 mt-2'>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
          <button disabled={name.length === 0} className='modal-positive-btn'>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewCollectionModal;
