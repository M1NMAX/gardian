import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import React, { FC, Fragment } from 'react';


interface CollectionMenuProps {
    onClickRename: (ev: React.MouseEvent<HTMLButtonElement>) => void,
    onClickDelete: (ev: React.MouseEvent<HTMLButtonElement>) => void,
    variant?: "primary" | "secondary",
}

const CollectionMenu: FC<CollectionMenuProps> = ({ variant = "secondary", onClickRename, onClickDelete }) => {
    return (
        <Menu as="div" className="relative" >
            <Menu.Button className={`btn btn-${variant}`}>
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
                <div className='fixed z-10'>
                    <Menu.Items as="ul" className="absolute  z-10  -top-4 -right-8 w-fit p-1 rounded border  origin-top-right bg-white dark:bg-gray-900">
                        <Menu.Item as="li">
                            <button onClick={onClickRename}
                                className='w-full space-x-1 btn btn-secondary'>
                                <PencilIcon className='icon-sm' />
                                <span>
                                    Rename
                                </span>
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button onClick={onClickDelete}
                                className='w-full space-x-1 btn btn-secondary'>
                                <TrashIcon className='icon-sm' />
                                <span> Delete </span>
                            </button>
                        </Menu.Item>
                    </Menu.Items>
                </div>
            </Transition>
        </Menu>
    )
}

export default CollectionMenu