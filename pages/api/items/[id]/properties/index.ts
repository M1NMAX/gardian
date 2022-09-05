import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(id)) return res.status(400).json({ isSuccess: false });

  // add new property to item array
  if (method === 'PUT') {
    try {
      const property = req.body.property;

      const item = await prisma.item.update({
        where: { id },
        data: { properties: { push: [property] } },
      });

      if (!item) return res.status(400).json({ isSuccess: false });

      return res.status(200).json({ isSuccess: true, data: item });
    } catch (error) {
      console.log('[api] items/[id]/properties/', error);
      return res.status(400).json({ isSuccess: false });
    }
  } else {
    return res.status(400).json({ isSuccess: false });
  }
};
