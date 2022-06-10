import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Group from '../../../backend/models/Group';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { query: { id }, method } = req;

    switch (method) {
        case 'GET':
            try {
                const group = await Group.findById(id);
                if (!group) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: group });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PUT':
            try {
                const group = await Group.findByIdAndUpdate(id,
                    { ...req.body, updatedAt: Date.now() },
                    {
                        new: true,
                        runValidators: true,
                    });
                if (!group) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: group });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PATCH':
            try {
                const group = await Group.findByIdAndUpdate(id, { name: req.body.name, $currentDate: { updatedAt: true } }, {
                    new: true,
                    runValidators: true,
                });
                if (!group) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: group });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedGroup = await Group.deleteOne({ _id: id });
                if (!deletedGroup) return res.status(400).json({ isSuccess: false });
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