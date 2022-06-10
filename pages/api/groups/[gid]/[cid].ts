import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../backend/database/dbConnect';
import Group from '../../../../backend/models/Group';
import { Response } from '../../../../types';

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { gid, cid },
    method,
  } = req;

  //gid groupId
  //cid collectionId

  //Add or remove from group
  switch (method) {
    case 'PATCH':
      try {
        const group = await Group.findByIdAndUpdate(
          gid,
          { $push: { collections: cid } },
          { new: true }
        );

        if (!group) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: group });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'DELETE':
      try {
        const group = await Group.findByIdAndUpdate(
          gid,
          { $pull: { collection: cid } },
          { new: true }
        );
        if (!group) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: group });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    default:
      res.status(400).json({ isSuccess: false });
      break;
  }
};
