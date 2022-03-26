import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import CustomItem from '../../../backend/models/CustomItem';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { query: { id }, method } = req;

    switch (method) {
        case 'GET':
            try {
                const customItem = await CustomItem.findById(id);
                if (!customItem) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: customItem });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PUT':
            try {
                const customItem = await CustomItem.findByIdAndUpdate(id, { ...req.body, updatedAt: Date.now() }, {
                    new: true,
                    runValidators: true,
                });
                if (!customItem) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: customItem });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedCustomItem = await CustomItem.deleteOne({ _id: id });
                if (!deletedCustomItem) return res.status(400).json({ isSuccess: false });
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