import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Collection from '../../../backend/models/Collection';
import { CollectionInterface } from '../../../backend/interfaces';


type Response = {
    success: boolean,
    data?: CollectionInterface[],
}
dbConnect();

//TODO: input validation
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const { method } = req;
    switch (method) {
        case 'GET':
            try {
                const collections = await Collection.find({});
                res.status(200).json({ success: true, data: collections });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const collection = await Collection.create(req.body);
                res.status(201).json({ success: true, data: collection });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
