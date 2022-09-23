import React, {
  ChangeEvent,
  Dispatch,
  FC,
  Fragment,
  SyntheticEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ActionIcon,
  Button,
  Input,
  Modal,
  Select,
  TextInput,
} from '@frontstate-ui';
import { Popover, Transition } from '@headlessui/react';
import {
  ArrowLongRightIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
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

const ACTIONS_ADD = 'add';
const ACTIONS_REMOVE = 'remove';
const ACTIONS_RENAME = 'rename';
const ACTIONS_UPD_COLOR = 'updColor';

type Actions =
  | { type: 'add'; payload: { value: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'updColor'; payload: { id: string; color: Color } };

const OptionReducer = (state: Option[], action: Actions) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS_ADD:
      const id = uuidv4();
      return [...state, { id, value: payload.value, color: Color.BW }];

    case ACTIONS_REMOVE:
      return state.filter((option) => option.id !== payload.id);

    case ACTIONS_RENAME:
      return state.map((option) =>
        option.id === payload.id ? { ...option, value: payload.name } : option
      );
    case ACTIONS_UPD_COLOR:
      return state.map((option) =>
        option.id === payload.id ? { ...option, color: payload.color } : option
      );

    default:
      return state;
  }
};

const EditPropertyModal: FC<EditPropertyModalProps> = (props) => {
  const { open, handleClose, property, onUpdate } = props;

  const [name, setName] = useState(property.name);
  const [selectedType, setSelectedType] = useState(property.type);
  const [newOption, setNewOption] = useState('');
  const [showNewOptionInput, setShowNewOptionInput] = useState(false);

  const [options, dispatch] = useReducer(OptionReducer, property.options);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PropertyType;
    setSelectedType(value);
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
                dispatch({ type: ACTIONS_ADD, payload: { value: newOption } });
                e.stopPropagation();
              }
            }}
            onBlur={() => setShowNewOptionInput(false)}
            radious='sm'
            size='sm'
            rightSection={
              <ActionIcon
                onClick={() =>
                  dispatch({ type: ACTIONS_ADD, payload: { value: newOption } })
                }>
                <ArrowLongRightIcon className='icon-xs' />
              </ActionIcon>
            }
          />
        )}
        {options.map((option) => (
          <PropertyOption key={option.id} option={option} dispatch={dispatch} />
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
  dispatch: Dispatch<Actions>;
}
const PropertyOption: FC<PropertyOptionProps> = (props) => {
  const { option, dispatch } = props;

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(option.value);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    console.log(inputRef.current);
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
              dispatch({
                type: ACTIONS_RENAME,
                payload: { id: option.id, name },
              });

              setEdit(false);
              e.stopPropagation();
            }
          }}
          onBlur={() => setEdit(false)}
          radious='sm'
          size='sm'
          rightSection={
            <ActionIcon
              onClick={() =>
                dispatch({
                  type: ACTIONS_RENAME,
                  payload: { id: option.id, name },
                })
              }>
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
              <Popover.Panel className='absolute left-0 bottom-full z-10 mb-0 px-4 sm:px-0 max-w-fit'>
                {({ close }) => (
                  <div
                    className='flex items-center justify-between space-x-0.5 rounded-md
                     bg-gray-200 dark:bg-gray-700 overflow-hidden'>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          dispatch({
                            type: ACTIONS_UPD_COLOR,
                            payload: { id: option.id, color },
                          });

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
            <ActionIcon
              onClick={() =>
                dispatch({ type: ACTIONS_REMOVE, payload: { id: option.id } })
              }>
              <TrashIcon className='icon-xs' />
            </ActionIcon>
          </span>
        </>
      )}
    </div>
  );
};

export default EditPropertyModal;
