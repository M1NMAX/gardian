import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../backend/database/dbConnect";
import Todo from "../../../backend/models/Todo";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Response } from "../../../types";

dbConnect();

export default withApiAuthRequired(
    async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
        const session = getSession(req, res);
        const user = session?.user;
        const { method } = req;
        if (method === 'POST') {
            try {
                const todo = await Todo.create({ ...req.body, userId: user?.sub });
                res.status(201).json({ isSuccess: true, data: todo });
            } catch (error) {
                res.status(400).json({ isSuccess: false })
            }
        } else {
            res.status(400).json({ isSuccess: false });
        }
    }
)