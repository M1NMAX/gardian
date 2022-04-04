import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Event from '../../../backend/models/Event';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse<Response>) => {
        const { query: { id }, method } = req;

        switch (method) {
            case 'GET':
                try {
                    const event = await Event.findById(id);
                    if (!event) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: event });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'PUT':
                try {
                    const data = {
                        name: req.body.name,
                        updatedAt: Date.now()
                    }
                    const event = await Event.findByIdAndUpdate(id, { ...req.body, $currentDate: { updatedAt: true } }, {
                        new: true,
                        runValidators: true,
                    });
                    if (!event) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: event });

                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'PATCH':
                try {
                    const event = await Event.findByIdAndUpdate(id, { name: req.body.name, $currentDate: { updatedAt: true } }, {
                        new: true,
                        runValidators: true,
                    });
                    if (!event) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: event });

                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'DELETE':
                try {
                    const deletedEvent = await Event.deleteOne({ _id: id });
                    if (!deletedEvent) return res.status(400).json({ isSuccess: false });
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
)