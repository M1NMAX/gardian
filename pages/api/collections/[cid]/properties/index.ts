import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { cid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(cid)) return res.status(400).json({ isSuccess: false });

  if (method === 'PUT') {
    try {
      const property = req.body.property;

      const collection = await prisma.collection.update({
        where: { id: cid },
        data: {
          properties: {
            push: [property],
          },
        },
      });

      if (!collection) return res.status(400).json({ isSuccess: false });

      return res.status(200).json({ isSuccess: true, data: collection });
    } catch (error) {
      console.log('[api] collections/properties/', error);
      return res.status(400).json({ isSuccess: false });
    }
  } else {
    return res.status(400).json({ isSuccess: false });
  }
};
