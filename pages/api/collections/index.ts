import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const userId = session.user.id;

  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const collections = await prisma.collection.findMany({
          where: { userId },
          include: { _count: { select: { items: true } } },
          orderBy: { name: 'asc' },
        });

        return res.status(200).json({ isSuccess: true, data: collections });
      } catch (error) {
        console.log('[api] collections/', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'POST':
      try {
        console.log(req.body.collection);
        const collection = await prisma.collection.create({
          data: { ...req.body.collection, userId },
        });

        return res.status(201).json({ isSuccess: true, data: collection });
      } catch (error) {
        console.log('[api] collections/', error);
        return res.status(500).json({ isSuccess: false, message: error });
      }

    default:
      return res.status(400).json({ isSuccess: false });
  }
};
