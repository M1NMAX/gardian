import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // gid: short for groupId
  const {
    query: { cid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(cid)) return res.status(400).json({ isSuccess: false });

  if (method === 'GET') {
    try {
      const items = await prisma.item.findMany({
        where: { collectionId: cid },
        orderBy: { name: 'asc' },
      });

      if (!items) return res.status(400).json({ isSuccess: false });
      return res.status(200).json({ isSuccess: true, data: items });
    } catch (error) {
      console.log('[api] items/collection/[cid]', error);
      return res.status(400).json({ isSuccess: false });
    }
  } else {
    return res.status(400).json({ isSuccess: false });
  }
};
