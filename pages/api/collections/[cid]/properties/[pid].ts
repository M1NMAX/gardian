import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  //cid: short for collectionId
  //pid: short for propertyId
  const {
    query: { cid, pid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(cid) || Array.isArray(pid)) {
    return res.status(400).json({ isSuccess: false });
  }

  switch (method) {
    case 'PUT':
      try {
        const { name, type, options } = req.body.property;

        const collection = await prisma.collection.update({
          where: { id: cid },
          data: {
            properties: {
              updateMany: { where: { id: pid }, data: { name, type, options } },
            },
          },
        });

        if (!collection) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        console.log('[api] collections/properties/[pid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'DELETE':
      try {
        const collection = await prisma.collection.update({
          where: { id: cid },
          data: {
            properties: { deleteMany: { where: { id: pid } } },
          },
        });

        if (!collection) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true });
      } catch (error) {
        console.log('[api] collections/properties/[pid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    default:
      return res.status(400).json({ isSuccess: false });
  }
};
