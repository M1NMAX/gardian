import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../backend/database/dbConnect';
import Collection from '../../../../backend/models/Collection';
import { Response } from '../../../../types';

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  //cid short for collectionId
  const {
    query: { cid },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const collection = await Collection.findById(cid);
        if (!collection) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'PUT':
      try {
        const collection = await Collection.findByIdAndUpdate(
          cid,
          { ...req.body, updatedAt: Date.now() },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!collection) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;

    case 'DELETE':
      try {
        const deletedCollection = await Collection.deleteOne({ _id: cid });
        if (!deletedCollection)
          return res.status(400).json({ isSuccess: false });
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
