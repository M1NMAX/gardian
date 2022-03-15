import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Collection from '../../../backend/models/Collection';
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
                    const collections = await Collection.find({ owner_id: user?.sub }).sort({ createdAt: -1 });
                    res.status(200).json({ isSuccess: true, data: collections });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'POST':
                try {

                    const data = {
                        name: req.body.name,
                        owner_id: user?.sub
                    }
                    const collection = await Collection.create(data);
                    res.status(201).json({ isSuccess: true, data: collection });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            default:
                res.status(400).json({ isSuccess: false });
                break;
        }
    });
