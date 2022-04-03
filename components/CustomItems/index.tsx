import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { CustomItemInterface } from '../../interfaces';
import Badge from '../Badge';
import CollectionMenu from '../CollectionMenu';
import EditCustomItemModal from '../EditCustomItemModal';
import DeleteModal from '../DeleteModal';
import { deleteCustomItem, renameCustomItem } from '../../fetch/customItems';
import RenameModal from '../RenameModal';

const Customs = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;
    const { data } = useQuery<CustomItemInterface[]>('customItems', async (): Promise<CustomItemInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/customItems/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    return (
        <div>Customs

            <div className='flex flex-col space-y-1'>
                {data?.map((item, idx) => (
                    <Item key={idx} item={item} />
                ))}

            </div>
        </div>
    )
}

interface ItemProps {
    item: CustomItemInterface
}


const Item: FC<ItemProps> = ({ item }) => {
    const [editItemModal, setEditItemModal] = useState(false);
    const openEditItemModal = () => setEditItemModal(true);
    const closeEditItemModal = () => setEditItemModal(false);


    const positiveFeedback = (msg: string) => toast.success(msg);
    const negativeFeedback = () => toast.success("Something went wrong, try later");


    //Rename Item fuction
    const handleRenameItem = (name: string): void => {
        if (!item._id) return;
        try {
            renameCustomItem(item._id.toString(), name);
            closeRenameItemModal()
            positiveFeedback("Item renamed successfully")
        } catch (error) {
            negativeFeedback()
        }
    }

    //Delete item fuction
    const handleDeleteItem = () => {
        if (!item._id) return;
        try {
            deleteCustomItem(item._id.toString());
            closeDeleteItemModal()
            positiveFeedback("Item deleted successfully")
        } catch (error) {
            negativeFeedback()
        }
    }

    //Delete Item Modal
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const openDeleteItemModal = () => setDeleteItemModal(true);
    const closeDeleteItemModal = () => setDeleteItemModal(false);

    //Rename Item Modal
    const [renameItemModal, setRenameItemModal] = useState(false);
    const openRenameItemModal = () => setRenameItemModal(true);
    const closeRenameItemModal = () => setRenameItemModal(false);

    return (
        <div className='flex justify-between items-center px-2 py-1 rounded-sm border'>

            <button onClick={openEditItemModal} className="flex flex-col">
                <span>
                    {item.name}
                </span>
                <span className='flex space-x-1'>
                    {item.properties?.map((property, idx) =>
                        <Badge key={idx} text={property.value} variant="primary"
                            rounded='lg' textSize='xs' uppercase />)
                    }
                </span>
            </button>

            <CollectionMenu onClickRename={openRenameItemModal} onClickDelete={openDeleteItemModal} />
            {/* {editItemModal && <EditCustomItemModal open={editItemModal} handleClose={closeEditItemModal}
                positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback}
                itemId={item._id?.toString()} />} */}


            {renameItemModal && <RenameModal open={renameItemModal} handleClose={closeRenameItemModal}
                name={item.name} onRename={handleRenameItem} />}

            {deleteItemModal && <DeleteModal open={deleteItemModal} handleClose={closeDeleteItemModal}
                name={item.name} onDelete={handleDeleteItem} />}
        </div>
    );
}
export default Customs