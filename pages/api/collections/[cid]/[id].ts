import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../backend/database/dbConnect';
import Collection from '../../../../backend/models/Collection';
import { Response } from '../../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { query: { cid, id }, method } = req;

    switch (method) {
        case 'PATCH':
            try {
                //Remove item id from collection

                //Check if collection exists
                let collection = Collection.findById(cid);
                if (!collection) return res.status(400).json({ isSuccess: false });

                //Remove item id from collection
                await Collection.findByIdAndUpdate(cid, { $pull: { items: id } });
                res.status(200).json({ isSuccess: true });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        default:
            res.status(400).json({ isSuccess: false });
            break;
    }
}