import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../backend/database/dbConnect';
import Item from '../../../../../backend/models/Item';
import { Response } from '../../../../../types';

dbConnect();

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { id, pid },
    method,
  } = req;

  switch (method) {
    case 'POST':
      try {
        const property = req.body.property;
        const item = await Item.findByIdAndUpdate(
          id,
          { $push: { properties: property } },
          { new: true, runValidators: true }
        );
        if (!item) return res.status(400).json({ isSuccess: false });
        res.status(200).json({ isSuccess: true, data: item });
      } catch (error) {
        res.status(400).json({ isSuccess: false });
      }
      break;
    default:
      res.status(400).json({ isSuccess: false });
      break;
  }
};
