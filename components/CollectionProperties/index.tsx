import { MenuAlt1Icon, SelectorIcon, TagIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'
import { PropertyInCollectionInterface } from '../../interfaces'


interface CollectionPropertiesProps {
    properties: PropertyInCollectionInterface[]
}
const CollectionProperties: FC<CollectionPropertiesProps> = ({ properties }) => {

    const handleIcon = (t: string): JSX.Element => {
        let propertyIcon: JSX.Element;

        switch (t) {
            case 'Select':
                propertyIcon = <SelectorIcon />
                break;
            case 'Text':
                propertyIcon = <MenuAlt1Icon />
                break;
            default:
                propertyIcon = <TagIcon />
                break
        }
        return propertyIcon;

    }


    return (
        <>
            <p className="w-full">Properties: </p>
            <div className='px-1'>
                {properties.map((property, idx) => (
                    <div key={idx} className="cursor-pointer flex items-center space-y-1 space-x-2
                         rounded-md hover:bg-gray-300 dark:hover:bg-gray-600" >
                        <span className='flex items-center icon-xs'>
                            {handleIcon(property.type)}
                        </span>
                        <span>
                            {property.name}
                        </span>
                        {property.type === "Select" && (
                            <span className='italic'>
                                {property.values.toString()}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default CollectionProperties