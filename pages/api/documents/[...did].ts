import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import dbConnect from "../../../backend/database/dbConnect";
import Document from "../../../backend/models/Document";
import { Response } from "../../../types";

dbConnect();

//TODO: cid[1] validation
export default withApiAuthRequired(
    async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

        const session = getSession(req, res);
        const user = session?.user;
        const { query: { did }, method } = req;

        if (method === 'GET' && did[0] === 'collectionId') {
            try {
                const documents = await Document.find({ userId: user?.sub, collectionId: did[1] }).sort({ createdAt: -1 });
                res.status(200).json({ isSuccess: true, data: documents });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
        } else {
            res.status(400).json({ isSuccess: false })
        }
    }
)