import { PencilIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'
import { PropertyInCollectionInterface } from '../../interfaces'
import Badge from '../Badge'
import IconBtn from '../IconBtn'


interface CollectionPropertiesProps {
    properties: PropertyInCollectionInterface[]
}
const CollectionProperties: FC<CollectionPropertiesProps> = ({ properties }) => {

    return (
        <>
            <p className="w-full">Properties </p>
            <div className='px-1'>
                <table className="table-auto w-full">
                    <thead>
                        <tr className='border-b'>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property, idx) => (
                            <tr key={idx} className="border-b" >
                                <td>

                                    <Badge text={property.type} variant="primary" />
                                </td>
                                <td>

                                    <Badge text={property.name} variant="primary" />
                                </td>
                                <td className='flex space-x-2'>

                                    {property.type === "select" && (
                                        <span className='italic flex items-center space-x-1.5'>
                                            {property.values.map((value) => (<Badge text={value} variant='secondary' />))}
                                        </span>
                                    )}
                                    <IconBtn icon={<PencilIcon />} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CollectionProperties