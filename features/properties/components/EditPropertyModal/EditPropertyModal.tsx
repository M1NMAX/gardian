import React, {
  ChangeEvent,
  FC,
  Fragment,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionIcon, Button, Input, Modal, Select, TextInput } from '@frontstate-ui';
import { Popover, Transition } from '@headlessui/react';
import {
  ArrowLongRightIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import { Color, Option, Property, PropertyType } from '@prisma/client';
import style from './EditPropertyModal.module.css';


const propertyTypes: PropertyType[] = [
  PropertyType.TEXT,
  PropertyType.SELECT,
  PropertyType.CHECKBOX,
  PropertyType.URL,
  PropertyType.DATE,
  PropertyType.NUMBER,
];

const colors: Color[] = [
  Color.BW,
  Color.RED,
  Color.BLUE,
  Color.GREEN,
  Color.YELLOW,
];

interface EditPropertyModalProps {
  open: boolean;
  property: Property;
  handleClose: () => void;
  onUpdate: (property: Property) => void;
}
const EditPropertyModal: FC<EditPropertyModalProps> = (props) => {
  const { open, handleClose, property, onUpdate } = props;

  const [name, setName] = useState(property.name);
  const [selectedType, setSelectedType] = useState(property.type);
  const [options, setOptions] = useState(property.options);
  const [newOption, setNewOption] = useState('');
  const [showNewOptionInput, setShowNewOptionInput] = useState(false);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PropertyType;
    setSelectedType(value);
  };

  const handleRemoveOption = (optionId: string) => {
    if (!optionId) return;
    setOptions(options.filter((option) => option.id !== optionId));
  };

  const handleAddOption = (value: string) => {
    if (!value || value === '') return;
    const id = uuidv4();
    setOptions([...options, { id, value, color: Color.BW }]);
  };

  const handleRenameOption = (id: string, name: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, value: name } : option
      )
    );
  };

  const handleUpdOptionColor = (id: string, color: Color) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, color } : option
      )
    );
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onUpdate({ ...property, name, options, type: selectedType });
    handleClose();
  };

  return (
    <Modal open={open} onHide={handleClose} withCloseBtn={false} size='sm'>
      <TextInput
        label='Name'
        name='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Property name'
      />

      <div className='mt-1'>
        <Select
          label='Property type'
          value={selectedType}
          onChange={handleSelect}
          data={propertyTypes.map((type) => ({
            label: type.charAt(0) + type.slice(1).toLowerCase(),
            value: type,
          }))}
        />
      </div>

      <div
        className={` mt-1.5 space-y-0.5 ${
          selectedType !== PropertyType.SELECT && 'hidden'
        }`}>
        <div className='flex justify-between items-center mb-0.5'>
          <p>Options</p>
          <ActionIcon onClick={() => setShowNewOptionInput(true)}>
            <PlusIcon className='icon-xs' />
          </ActionIcon>
        </div>
        {showNewOptionInput && (
          <Input
            name='newOption'
            srLabel='Type new option'
            placeholder='New option'
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleAddOption(newOption);
                e.stopPropagation();
              }
            }}
            onBlur={() => setShowNewOptionInput(false)}
            radious='sm'
            size='sm'
            rightSection={
              <ActionIcon onClick={() => handleAddOption(newOption)}>
                <ArrowLongRightIcon className='icon-xs' />
              </ActionIcon>
            }
          />
        )}
        {options.map((option) => (
          <PropertyOption
            key={option.id}
            option={option}
            onRemoveOption={handleRemoveOption}
            onRenameOption={handleRenameOption}
            onColorUpd={handleUpdOptionColor}
          />
        ))}
      </div>
      <div className='flex justify-end space-x-2 mt-2'>
        <Button onClick={handleClose}>
          <span className='text-lg mx-4'>Cancel</span>
        </Button>
        <Button onClick={handleSubmit} variant='primary-filled' type='submit'>
          <span className='text-lg mx-4'>Save</span>
        </Button>
      </div>
    </Modal>
  );
};

interface PropertyOptionProps {
  option: Option;
  onRemoveOption: (optionId: string) => void;
  onRenameOption: (optionId: string, name: string) => void;
  onColorUpd: (optionId: string, color: Color) => void;
}
const PropertyOption: FC<PropertyOptionProps> = (props) => {
  const { option, onRemoveOption, onRenameOption, onColorUpd } = props;

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(option.value);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <div
      className='flex items-center justify-between space-x-1 h-8 rounded-sm bg-gray-200
       dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 group'>
      {edit ? (
        <Input
          ref={inputRef}
          name='newOption'
          srLabel='Type new option'
          placeholder='New option'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onRenameOption(option.id, name);
              setEdit(false);
              e.stopPropagation();
            }
          }}
          onBlur={() => setEdit(false)}
          radious='sm'
          size='sm'
          rightSection={
            <ActionIcon onClick={() => onRenameOption(option.id, name)}>
              <ArrowLongRightIcon className='icon-xs' />
            </ActionIcon>
          }
        />
      ) : (
        <>
          <Popover className='relative'>
            <Popover.Button className='flex items-center'>
              <StopIcon
                className={`${style[option.color.toLowerCase()]} icon-md`}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'>
              <Popover.Panel
                className='absolute left-0 bottom-full z-10 mb-0 px-4 sm:px-0
           max-w-fit  '>
                {({ close }) => (
                  <div
                    className='flex items-center justify-between space-x-0.5
              rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden'>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          onColorUpd(option.id, color);
                          close();
                        }}
                        className={`${
                          style[color.toLowerCase()]
                        } flex items-center rounded hover:bg-gray-300 dark:hover:bg-gray-800`}>
                        <StopIcon
                          className={`${style[color.toLowerCase()]} icon-md `}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </Popover>
          <span className='grow px-1'>{option.value}</span>
          <span className='md:hidden md:group-hover:block'>
            <ActionIcon onClick={() => setEdit(true)}>
              <PencilSquareIcon className='icon-xs' />
            </ActionIcon>
          </span>

          <span className='md:hidden md:group-hover:block'>
            <ActionIcon onClick={() => onRemoveOption(option.id)}>
              <TrashIcon className='icon-xs' />
            </ActionIcon>
          </span>
        </>
      )}
    </div>
  );
};

export default EditPropertyModal;
