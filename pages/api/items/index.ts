import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Item from '../../../backend/models/Item';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Response } from '../../../types';

dbConnect();

//TODO: input validation
export default withApiAuthRequired(
    async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

        const session = getSession(req, res);
        const user = session?.user;
        const { method } = req;
        switch (method) {
            case 'GET':
                try {
                    const items = await Item.find({ userId: user?.sub }).sort({ name: 1 });
                    res.status(200).json({ isSuccess: true, data: items });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'POST':
                try {
                    const item = await Item.create({ ...req.body, userId: user?.sub });
                    res.status(201).json({ isSuccess: true, data: item });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            default:
                res.status(400).json({ isSuccess: false });
                break;
        }
    });
