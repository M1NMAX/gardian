import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //cid: short for collectionId
  const {
    query: { cid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(cid)) return res.status(400).json({ isSuccess: false });

  switch (method) {
    case 'GET':
      try {
        const collection = await prisma.collection.findUnique({
          where: { id: cid },
          include: { _count: { select: { items: true } } },
        });

        if (!collection) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        console.log('[api] collections/[cid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'PUT':
      try {
        const collection = await prisma.collection.update({
          where: { id: cid },
          data: { ...req.body },
        });

        if (!collection) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: collection });
      } catch (error) {
        console.log('[api] collections/[cid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'DELETE':
      try {
        const deletedCollection = await prisma.collection.delete({
          where: { id: cid },
        });
        if (!deletedCollection)
          return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true });
      } catch (error) {
        console.log('[api] collections/[cid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    default:
      return res.status(400).json({ isSuccess: false });
  }
};
