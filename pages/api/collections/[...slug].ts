import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import dbConnect from "../../../backend/database/dbConnect";
import Collection from "../../../backend/models/Collection";
import { Response } from "../../../types";

dbConnect();

//TODO: slug[1] validation
export default withApiAuthRequired(
    async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

        const session = getSession(req, res);
        const user = session?.user;
        const { query: { slug }, method } = req;

        if (method === 'GET' && slug[0] === 'collectionId') {
            try {
                const collections = await Collection.find({ userId: user?.sub, collectionId: slug[1], isSub: true }).sort({ createdAt: -1 });
                res.status(200).json({ isSuccess: true, data: collections });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
        } else {
            res.status(400).json({ isSuccess: false })
        }
    }
)