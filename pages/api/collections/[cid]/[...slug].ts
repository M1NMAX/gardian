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
        try {
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
        } catch (error) {
          res.status(400).json({ isSuccess: false });
        }

        break;
      case 'update':
        try {
          const property = req.body.property;
          const collection = await Collection.findByIdAndUpdate(
            cid,
            { $set: { template: { 'properties.$[element]': property } } },
            { arrayFilters: [{ 'element._id': property._id }] }
          );

          if (!collection) return res.status(400).json({ isSuccess: false });

          console.log(collection);

          res.status(200).json({ isSuccess: true, data: collection });
        } catch (error) {
          res.status(400).json({ isSuccess: false });
        }
        //Update property

        break;
      case 'remove':
        try {
          const propertyId = req.body.propertyId;
          //Remove property from collection template
          const collection = await Collection.findByIdAndUpdate(
            cid,
            { $pull: { template: { properties: { _id: propertyId } } } },
            { new: true }
          );

          if (!collection) return res.status(400).json({ isSuccess: false });

          //Remove property from all items of the collection
          const collectionItems = collection.items;

          const items = await Item.updateMany(
            { _id: { $in: collectionItems } },
            { $pull: { properties: { _id: propertyId } } }
          );
          console.log(collection);
          console.log(items ? 'yeys' : 'nnos');

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
