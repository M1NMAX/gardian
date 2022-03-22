import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../backend/database/dbConnect";
import Event from "../../../backend/models/Event";
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
                const event = await Event.create({ ...req.body, userId: user?.sub });
                res.status(201).json({ isSuccess: true, data: event })

            } catch (error) {
                res.status(400).json({ isSuccess: false });
            }

        } else {
            res.status(400).json({ isSuccess: false });
        }
    }
)

