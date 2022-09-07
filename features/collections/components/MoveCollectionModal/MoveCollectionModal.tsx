import React, { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { Modal } from '@frontstate-ui';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getGroups } from '../../../groups/services';


interface MoveCollectionModalProps {
  currentGroupId: string;
  open: boolean;
  handleClose: () => void;
  onMove: (gruopId: string) => void;
}

const MoveCollectionModal: FC<MoveCollectionModalProps> = (props) => {
  const { currentGroupId, open, handleClose, onMove } = props;

  const { data: groups } = useQuery('groups', getGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(currentGroupId);

  return (
    <Modal title='Move' open={open} onHide={handleClose}>
      <div className='w-full mt-2'>
        <RadioGroup value={selectedGroupId} onChange={setSelectedGroupId}>
          <RadioGroup.Label className='modal-input-label'>
            Groups
          </RadioGroup.Label>
          <div className='space-y-1'>
            {groups &&
              groups.map((group) => (
                <RadioGroup.Option
                  key={group.id}
                  value={group.id}
                  className={({ checked }) =>
                    `${
                      checked
                        ? 'bg-primary-200  text-white'
                        : 'bg-gray-300 dark:bg-gray-700'
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
                              <span>
                                {group.collections.length === 0
                                  ? 'Empty'
                                  : group.collections.length + ' Collections'}
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
        <button
          disabled={selectedGroupId === currentGroupId}
          onClick={() => {
            handleClose();
            onMove(selectedGroupId);
          }}
          className='modal-positive-btn'>
          Move
        </button>
      </div>
    </Modal>
  );
};

export default MoveCollectionModal;
