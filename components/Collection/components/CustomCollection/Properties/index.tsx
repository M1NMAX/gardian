import { Popover } from '@headlessui/react'
import { AnnotationIcon, PencilIcon, SelectorIcon, TrashIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'
import { PropertyInCollectionInterface } from '../../../../../interfaces'
interface PropertiesProps {
    properties: PropertyInCollectionInterface[]
}
const Properties: FC<PropertiesProps> = ({ properties }) => {

    const handlePropertyIcon = (propertyType: string): JSX.Element => {
        let result = <></>
        switch (propertyType) {
            case 'text':
                result = <AnnotationIcon className='icon-xs' />
                break;
            case 'select':
                result = <SelectorIcon className='icon-xs' />
                break;
        }
        return result;

    }

    return (
        <div className='flex items-center w-full'>
            {properties.map((property, idx) => (
                <Popover key={idx} className="relative">
                    {({ open, close }) =>
                    (
                        <>
                            <Popover.Button className="btn btn-secondary">
                                <span className='property-label'>
                                    {handlePropertyIcon(property.type)}
                                    <span>
                                        {property.name}
                                    </span>
                                </span>

                            </Popover.Button>
                            <Popover.Panel className="absolute bottom-12  z-10 w-screen max-w-xs  shadow-lg  bg-white dark:bg-gray-900 rounded-sm border ">
                                <div className='flex flex-col space-y-2 divide-y'>
                                    <div className='flex flex-col space-y-2.5 px-2 py-1'>
                                        <span className='text-2xl font-medium' >
                                            {property.name}
                                        </span>
                                        <span className='flex flex-col'>
                                            <span className='uppercase font-mono text-sm'>
                                                Property type
                                            </span>
                                            <span className='flex items-center space-x-1 rounded-sm bg-slate-300 dark:bg-slate-600 '>
                                                {handlePropertyIcon(property.type)}
                                                <span className='first-letter:uppercase'>
                                                    {property.type}
                                                </span>
                                            </span>
                                        </span>
                                        {property.values.length > 0 &&
                                            <span className='flex flex-col'>
                                                <span className='uppercase font-mono text-sm'>
                                                    Property values
                                                </span>
                                                <span className='flex flex-col space-y-0.5'>
                                                    {property.values.map((value, idx) => (
                                                        <span key={idx} className="px-1 rounded-sm bg-slate-300 dark:bg-slate-600 ">
                                                            {idx + 1} &middot; {value}
                                                        </span>
                                                    ))}
                                                </span>
                                            </span>
                                        }
                                    </div>

                                    <div className='flex flex-col px-2 py-1'>
                                        <button className='btn btn-secondary space-x-1'>
                                            <PencilIcon className="icon-xs" />
                                            <span>
                                                Edit
                                            </span>
                                        </button>
                                        <button className='btn btn-secondary space-x-1'>
                                            <TrashIcon className="icon-xs" />
                                            <span>
                                                Delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </>
                    )}

                </Popover>

            ))}
        </div>
    )
}

export default Properties

