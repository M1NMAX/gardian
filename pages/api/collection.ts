import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Collection from '../../models/Collection';

dbConnect();

interface Collection {
    name: string;
    updatedAt?: Date;
    createdAt?: Date;
}

type Response = {
    success: boolean,
    data?: Collection[],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const { method } = req;
    switch (method) {
        case 'GET':
            try {
                const collections = await Collection.find({});
                res.status(200).json({ success: true, data: collections });
            } catch (error) {
                console.log(error)
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const collection = await Collection.create({ name: "heoo" })
                console.log(collection);
                res.status(201).json({ success: true });

            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;

    }




}
