import React, { FC, useState } from "react"
import Modal from "../Modal";
import { CheckIcon } from "@heroicons/react/outline";
import { RadioGroup } from "@headlessui/react";
import { NewCollectionModalProps } from "../../interfaces";
import { createCollection } from "../../fetch/collections";

const kindsOfCollections = [
    {
        name: 'Custom',
        description: 'Collection of items with custom properties and can be group by it.',
        variant: 'custom',
    },
    {
        name: 'Events',
        description: 'Collection of events.',
        variant: 'event',
    },
    {
        name: 'Documents',
        description: 'Collection of related documents.',
        variant: 'document',
    },
    {
        name: 'ToDo',
        description: 'Checklist of task.',
        variant: 'todo',

    },
    {
        name: 'Collection',
        description: 'Collection of collection, each collection has it own type of item.',
        variant: 'collection',
    }
]

const NewCollectionModal: FC<NewCollectionModalProps> =
    ({ open, isSub, parentName, collectionId, handleClose, positiveFeedback, negativeFeedback }) => {

        const [name, setName] = useState("");
        const [selectedVariant, setSelectedVariant] = useState(kindsOfCollections[0].variant)
        const handleSubmit = async (e: React.SyntheticEvent) => {
            e.preventDefault();
            try {
                await createCollection(name, selectedVariant, isSub, parentName, collectionId);
                positiveFeedback("Collection created successfully");
                handleClose();
            } catch (error) {
                negativeFeedback();
            }

        }

        return (
            <Modal title="New Collection" open={open} onHide={handleClose}>
                <form onSubmit={handleSubmit}>

                    <label className="block">
                        <span className="w-full">Name</span>
                        <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                            placeholder="Collection name"
                            className='modal-input' />
                    </label>

                    <div className="w-full mt-2">
                        <RadioGroup value={selectedVariant} onChange={setSelectedVariant}>
                            <RadioGroup.Label>Type of collection</RadioGroup.Label>
                            <div className="space-y-1">
                                {kindsOfCollections.slice(0, isSub ? 4 : 5).map((kind) => (
                                    <RadioGroup.Option
                                        key={kind.name}
                                        value={kind.variant}
                                        className={({ active, checked }) =>
                                            `${active
                                                ? ''
                                                : ''
                                            }
                                                ${checked ? 'bg-primary bg-opacity-75 text-white' : 'bg-white'
                                            }
                                                 relative rounded-lg shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
                                        }>
                                        {({ checked }) => (
                                            <>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className="text-sm">
                                                            <RadioGroup.Label
                                                                as="p"
                                                                className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
                                                                    }`}
                                                            >
                                                                {kind.name}
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description
                                                                as="span"
                                                                className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
                                                                    }`}
                                                            >
                                                                <span>
                                                                    {kind.description}
                                                                </span>


                                                            </RadioGroup.Description>
                                                        </div>
                                                    </div>
                                                    {checked && (
                                                        <div className="flex-shrink-0 text-white">
                                                            <CheckIcon className="w-6 h-6" />
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

                    <div className="flex justify-end space-x-2 mt-2">
                        <button onClick={handleClose} className="modal-neutral-btn">
                            Cancel
                        </button>
                        <button className="modal-positive-btn">
                            Create
                        </button>
                    </div>

                </form>

            </Modal>

        )
    };

export default NewCollectionModal;