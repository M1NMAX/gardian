import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/database/dbConnect';
import Todo from '../../../backend/models/Todo';
import { Response } from '../../../types';

dbConnect();

//TODO:input validation
export default withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse<Response>) => {
        const { query: { id }, method } = req;

        switch (method) {
            case 'GET':
                try {
                    const todo = await Todo.findById(id);
                    if (!todo) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: todo });
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
                    const todo = await Todo.findByIdAndUpdate(id, data, {
                        new: true,
                        runValidators: true,
                    });
                    if (!todo) return res.status(400).json({ isSuccess: false });
                    res.status(200).json({ isSuccess: true, data: todo });

                } catch (error) {
                    res.status(400).json({ isSuccess: false });
                }
                break;
            case 'DELETE':
                try {
                    const deletedTodo = await Todo.deleteOne({ _id: id });
                    if (!deletedTodo) return res.status(400).json({ isSuccess: false });
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