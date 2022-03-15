import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Collection from '../../../backend/models/Collection';
import { CollectionInterface } from '../../../backend/interfaces';

dbConnect();

type Response = {
    success: boolean,
    data?: CollectionInterface,
}

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { query: { id }, method } = req;

    switch (method) {
        case 'GET':
            try {
                const collection = await Collection.findById(id);
                if (!collection) return res.status(400).json({ success: false });
                res.status(200).json({ success: true, data: collection });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const data = {
                    name: req.body.name,
                    updatedAt: Date.now()
                }
                const collection = await Collection.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!collection) return res.status(400).json({ success: false });
                res.status(200).json({ success: true, data: collection });

            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedCollection = await Collection.deleteOne({ _id: id });
                if (!deletedCollection) return res.status(400).json({ success: false });
                res.status(200).json({ success: true });

            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}