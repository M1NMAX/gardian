import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../backend/database/dbConnect';
import Collection from '../../../../backend/models/Collection';
import { Response } from '../../../../types';

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { cid, id },
    method,
  } = req;

  switch (method) {
    case 'PATCH':
      //Adds item to collection
      try {
        const collection = await Collection.findByIdAndUpdate(cid, {
          $push: { items: id },
        });
        if (!collection) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'DELETE':
      //Remove item from collection
      try {
        const collection = await Collection.findByIdAndUpdate(
          cid,
          { $pull: { items: id } },
          { new: true }
        );
        if (!collection) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    default:
      res.status(400).json({ isSuccess: false });
      break;
  }
};
