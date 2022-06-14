import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../backend/database/dbConnect';
import Collection from '../../../../../backend/models/Collection';
import { Response } from '../../../../../types';

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { cid, pid },
    method,
  } = req;

  switch (method) {
    case 'PUT':
      try {
        const property = req.body.property;
        const colleciton = await Collection.findByIdAndUpdate(
          cid,
          { $set: { 'properties.$[element]': property } },
          { arrayFilters: [{ 'element._id': pid }] }
        );
        if (!colleciton) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: colleciton });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'DELETE':
      try {
        const colleciton = await Collection.findByIdAndUpdate(cid, {
          $pull: { properties: { _id: pid } },
        });
        if (!colleciton) return res.status(400).json({ isSuccess: false });
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
