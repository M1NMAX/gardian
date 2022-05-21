import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Item from '../../../backend/models/Item';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { query: { id }, method } = req;

    switch (method) {
        case 'GET':
            try {
                const item = await Item.findById(id);
                if (!item) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: item });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PUT':
            try {
                const item = await Item.findByIdAndUpdate(id,
                    { ...req.body, updatedAt: Date.now() },
                    {
                        new: true,
                        runValidators: true,
                    });
                if (!item) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: item });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PATCH':
            try {
                const item = await Item.findByIdAndUpdate(id, { name: req.body.name, $currentDate: { updatedAt: true } }, {
                    new: true,
                    runValidators: true,
                });
                if (!item) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: item });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedItem = await Item.deleteOne({ _id: id });
                if (!deletedItem) return res.status(400).json({ isSuccess: false });
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