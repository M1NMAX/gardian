import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../backend/database/dbConnect";
import Todo from "../../../backend/models/Todo";
import { Response } from "../../../types";

dbConnect();

//TODO: param[1] validation
export default withApiAuthRequired(
    async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

        const session = getSession(req, res);
        const user = session?.user;
        const { query: { param }, method } = req;

        if (method === 'GET' && param[0] === 'collectionId') {
            try {
                const todos = await Todo.find({ userId: user?.sub, collectionId: param[1] }).sort({ createdAt: -1 });
                res.status(200).json({ isSuccess: true, data: todos });
            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }
        } else {
            res.status(400).json({ isSuccess: false })
        }
    }
)
