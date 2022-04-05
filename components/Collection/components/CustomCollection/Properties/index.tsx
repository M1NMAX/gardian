import { Popover } from '@headlessui/react'
import { AnnotationIcon, ClockIcon, SelectorIcon, TrashIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { PropertyInCollectionInterface } from '../../../../../interfaces'
import Badge from '../../../../Badge'


interface PropertiesProps {
    properties: PropertyInCollectionInterface[]
}
const Properties: FC<PropertiesProps> = ({ properties }) => {

    const handlePropertyIcon = (propertyType: string): JSX.Element => {
        let result = <></>
        switch (propertyType) {
            case 'text':
                result = <AnnotationIcon className='icon-sm' />
                break;
            case 'select':
                result = <SelectorIcon className='icon-sm' />
                break;
        }
        return result;

    }

    return (
        <>
            <div className='flex flex-row mt-2'>
                {properties.map((property, idx) => (
                    property.type === "text" &&
                    <div className='flex mr-1'>
                        <span className='property-label'>
                            {handlePropertyIcon(property.type)}
                            <span>
                                {property.name}
                            </span>
                        </span>
                    </div>))}


            </div>


            <div className='space-y-1 mt-2'>

                {properties.map((property, idx) => (
                    property.type === "select" &&
                    <div className='flex'>
                        <span className='property-label'>
                            {handlePropertyIcon(property.type)}
                            <span>
                                {property.name}
                            </span>
                        </span>

                        <Popover key={idx} className="relative">
                            {({ open, close }) =>
                            (
                                <>
                                    <Popover.Button className="btn btn-secondary w-full">


                                        {property.type === "select" && (
                                            <span className='italic flex items-center space-x-1.5'>
                                                {property.values.map((value, idx) => (
                                                    <Badge key={idx} text={value} variant='secondary' />
                                                ))}
                                            </span>
                                        )}
                                    </Popover.Button>
                                    <Popover.Panel className="absolute top-2 z-10 w-max p-2 shadow-lg  bg-white dark:bg-gray-900 rounded border ">
                                        <EditPorpertyForm property={property} />
                                    </Popover.Panel>
                                </>
                            )}

                        </Popover>
                    </div>
                ))}


            </div>
        </>
    )
}

export default Properties

interface EditPorpertyFormProp {
    property: PropertyInCollectionInterface,
    onUpdate?: (property: PropertyInCollectionInterface) => void,
}


const EditPorpertyForm: FC<EditPorpertyFormProp> = ({ property, onUpdate }) => {
    const [name, setName] = useState(property.name);
    const [values, setValues] = useState(property.values);
    const [newValue, setNewValue] = useState("")


    const addValue = (): void => {
        if (newValue == null || newValue == '') return;
        if (values.length >= 5) return;
        setValues([...values, newValue]);
        setNewValue("");
    }



    return (
        <div className='flex flex-col space-y-2'>

            <div className='flex flex-row'>


                {values.map((value, idx) => (
                    <div key={idx} className="flex items-center justify-between ml-1 rounded 
                    dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 group">
                        <span className="px-1">
                            {value}
                        </span>
                        <button
                            className="rounded-md hover:bg-gray-300 dark:hover:bg-gray-100 hover:text-black  hidden group-hover:block" >
                            <TrashIcon className="icon-xs" />
                        </button>
                    </div>
                ))}
            </div>

            <input type="text" name="newValue" value={newValue} onChange={(e) => { setNewValue(e.target.value) }}
                placeholder="New value"
                className='modal-input' />

            <div className="flex justify-end space-x-2 mt-2">
                <button className="modal-neutral-btn">
                    close
                </button>
                <button onClick={addValue}

                    key={1} type="button" className="modal-positive-btn">
                    Add
                </button>
            </div>

        </div>
    )
}
