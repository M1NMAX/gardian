import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Document from '../../../backend/models/Document';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse<Response>) => {
        const { query: { id }, method } = req;

        switch (method) {
            case 'GET':
                try {
                    const document = await Document.findById(id);
                    if (!document) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: document });
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
                    const document = await Document.findByIdAndUpdate(id, data, {
                        new: true,
                        runValidators: true,
                    });
                    if (!document) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: document });

                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'DELETE':
                try {
                    const deletedDocument = await Document.deleteOne({ _id: id });
                    if (!deletedDocument) return res.status(400).json({ isSuccess: false });
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