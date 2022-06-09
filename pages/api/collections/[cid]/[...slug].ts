import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../backend/database/dbConnect';
import Collection from '../../../../backend/models/Collection';
import Item from '../../../../backend/models/Item';
import { Response } from '../../../../types';

dbConnect();

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    query: { cid, slug },
    method,
  } = req;
  console.log('CollectionId', cid);
  console.log('slug??', slug);

  if (method === 'PATCH' && slug.length === 2 && slug[0] === 'template') {
    switch (slug[1]) {
      case 'new':
        // Add new property to collection template
        const collection = await Collection.findByIdAndUpdate(
          cid,
          {
            $push: { 'template.properties': req.body.property },
          },
          { new: true }
        );

        if (!collection) return res.status(400).json({ isSuccess: false });

        //Add the new property to all collection item
        const collectionItems = collection.items;
        const properties = collection.template.properties;
        const lastProperty = properties[properties.length - 1];

        const items = await Item.updateMany(
          { _id: { $in: collectionItems } },
          { $push: { properties: lastProperty } }
        );
        console.log(items ? 'via' : 'fnn');
        // optimistic upd populate colleciton with
        res.status(200).json({ isSuccess: true, data: collection });

        break;
      case 'update':
        console.log('upd property');
        break;
      case 'remove':
        try {
          console.log('remove property');
          const collection = await Collection.findByIdAndUpdate(cid, {
            $push: { 'template.properties': req.body.property },
          });

          if (!collection) return res.status(400).json({ isSuccess: false });
          console.log('via');
          console.log(collection.items);
          res.status(200).json({ isSuccess: true, data: collection });
        } catch (error) {
          res.status(400).json({ isSuccess: false });
        }
        break;

      default:
        res.status(400).json({ isSuccess: false });
        break;
    }
  } else {
    res.status(400).json({ isSuccess: false });
  }
};
