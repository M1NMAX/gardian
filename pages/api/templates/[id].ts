import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Template from '../../../backend/models/Template';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { query: { id }, method } = req;

    switch (method) {
        case 'GET':
            try {
                const template = await Template.findById(id);
                if (!template) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: template });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PUT':
            try {
                const template = await Template.findByIdAndUpdate(id,
                    { ...req.body, updatedAt: Date.now() },
                    {
                        new: true,
                        runValidators: true,
                    });
                if (!template) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: template });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'PATCH':
            try {
                const template = await Template.findByIdAndUpdate(id, { name: req.body.name, $currentDate: { updatedAt: true } }, {
                    new: true,
                    runValidators: true,
                });
                if (!template) return res.status(400).json({ isSuccess: false });
                res.status(200).json({ isSuccess: true, data: template });

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedTemplate = await Template.deleteOne({ _id: id });
                if (!deletedTemplate) return res.status(400).json({ isSuccess: false });
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