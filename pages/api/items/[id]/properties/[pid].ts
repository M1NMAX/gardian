import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../backend/database/dbConnect';
import Item from '../../../../../backend/models/Item';
import { Response } from '../../../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { id, pid },
    method,
  } = req;

  switch (method) {
    case 'PUT':
      try {
        const property = req.body.property;
        const item = await Item.findByIdAndUpdate(
          id,
          { $set: { 'properties.$[element]': property } },
          { arrayFilters: [{ 'element._id': pid }] }
        );
        if (!item) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: item });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    case 'DELETE':
      try {
        const item = await Item.findByIdAndUpdate(id, {
          $pull: { properties: { _id: pid } },
        });
        if (!item) return res.status(400).json({ isSuccess: false });
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
