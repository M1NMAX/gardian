import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import CustomItem from '../../../backend/models/CustomItem';
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
                    const customItems = await CustomItem.find({ userId: user?.sub, isSub: false }).sort({ createdAt: -1 });
                    res.status(200).json({ isSuccess: true, data: customItems });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'POST':
                try {
                    const customItem = await CustomItem.create({ ...req.body, userId: user?.sub });
                    res.status(201).json({ isSuccess: true, data: customItem });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            default:
                res.status(400).json({ isSuccess: false });
                break;
        }
    });
