import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../backend/database/dbConnect';
import Group from '../../../../backend/models/Group';
import { Response } from '../../../../types';

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { gid },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const group = await Group.findById(gid);
        if (!group) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: group });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'PUT':
      try {
        const group = await Group.findByIdAndUpdate(
          gid,
          { ...req.body, updatedAt: Date.now() },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!group) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: group });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedGroup = await Group.deleteOne({ _id: gid });
        if (!deletedGroup) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    default:
      res.status(400).json({ isSuccess: false });
      break;
  }
};
