import React, { FC, Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';


type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface ModalProps {
  children: ReactNode;
  title?: ReactNode;
  open: boolean;
  onHide: (value: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  size?: SizeType;
  withCloseBtn?: boolean;
}

const sizes = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-5xl',
};

const Modal: FC<ModalProps> = (props) => {
  const {
    children,
    title,
    open,
    onHide,
    size = 'lg',
    withCloseBtn = true,
  } = props;

  const getSizeStyle = (size: SizeType) => sizes[size];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-75'
        onClose={onHide}>
        <div className='min-h-screen px-2 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Dialog.Overlay className='fixed inset-0' />
          </Transition.Child>

          <span
            className='inline-block h-screen md:align-middle'
            aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'>
            <div
              className={`${getSizeStyle(
                size
              )}  inline-block w-full p-2 md:p-4 my-8 overflow-hidden text-left align-middle transition-all 
                            transform shadow-xl rounded-md  bg-gray-100 dark:bg-gray-800  dark:border-white`}>
              <div className='flex justify-between'>
                <Dialog.Title
                  as='h3'
                  className='flex items-center text-lg font-medium leading-6 text-gray-900 dark:text-white'>
                  {title}
                </Dialog.Title>
                {withCloseBtn && (
                  <button
                    onClick={onHide}
                    className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white '>
                    <XMarkIcon className='icon-lg' />
                  </button>
                )}
              </div>
              <div className='dark:text-white'>{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
