import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { CustomItemInterface } from '../../interfaces';
import Badge from '../Badge';
import EditCustomItemModal from '../EditCustomItemModal';

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

    return (
        <>

            <div onClick={openEditItemModal} className="flex flex-col px-2 py-1 rounded-sm border">
                <span>
                    {item.name}
                </span>
                <span className='space-x-1'>
                    {item.properties?.map((property, idx) =>
                        <Badge key={idx} text={property.value} variant="primary" />)
                    }
                </span>
            </div>
            {editItemModal && <EditCustomItemModal open={editItemModal} handleClose={closeEditItemModal}
                positiveFeedback={positiveFeedback} negativeFeedback={negativeFeedback}
                itemId={item._id?.toString()} />}
        </>
    );
}
export default Customs