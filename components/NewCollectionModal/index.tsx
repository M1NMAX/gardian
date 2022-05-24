import React, { FC, useState } from 'react';
import Modal from '../Frontstate/Modal';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { RadioGroup } from '@headlessui/react';
import { IGroup, ModalProps } from '../../interfaces';
import { createCollection } from '../../fetch/collections';
import { CollectionIcon } from '@heroicons/react/outline';
import Label from '../Label';

interface NewCollectionModalProps extends ModalProps {
  groups: IGroup[];
}

const NewCollectionModal: FC<NewCollectionModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback, groups } =
    props;
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]._id);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      await createCollection({ name, groupId: selectedGroup });
      positiveFeedback('Collection created successfully');
      handleClose();
    } catch (error) {
      console.log(error);
      negativeFeedback();
    }
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
              Type of collection
            </RadioGroup.Label>
            <div className='space-y-1'>
              {groups.map((group, idx) => (
                <RadioGroup.Option
                  key={idx}
                  value={group._id}
                  className={({ active, checked }) =>
                    `${active ? '' : ''}
                                                ${
                                                  checked
                                                    ? 'bg-primary  text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800'
                                                }
                                                 relative rounded-md shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
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
                              <span>Description</span>
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
          <button className='modal-positive-btn'>Create</button>
        </div>
      </form>
    </Modal>
  );
};

export default NewCollectionModal;
