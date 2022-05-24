import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Collection from '../../../backend/models/Collection';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Response } from '../../../types';
import Group from '../../../backend/models/Group';

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
                    const collections = await Collection.find({ userId: user?.sub }).sort({ name: 1 });
                    res.status(200).json({ isSuccess: true, data: collections });
                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'POST':
                try {

                    const groupId = req.body.groupId;
                    console.log(groupId)
                    //Find the group
                    const group = Group.findById(groupId);
                    if (!group) res.status(400).json({ isSuccess: false });

                    //Create collection 
                    const collection = await Collection.create({ ...req.body, userId: user?.sub });

                    //Push collection id to group 
                    await Group.findByIdAndUpdate(groupId, { $push: { collections: collection._id } });
                    res.status(201).json({ isSuccess: true, data: collection });
                } catch (error) {
                    console.log(error)
                    res.status(400).json({ isSuccess: false });
                }
                break;
            default:
                res.status(400).json({ isSuccess: false });
                break;
        }
    });
