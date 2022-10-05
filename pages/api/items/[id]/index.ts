import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //id: item id
  const {
    query: { id },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(id)) return res.status(400).json({ isSuccess: false });

  switch (method) {
    case 'GET':
      try {
        const item = await prisma.item.findUnique({ where: { id } });

        if (!item) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: item });
      } catch (error) {
        console.log('[api] items/[id]/', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'PUT':
      try {
        const itemData: Prisma.ItemUpdateInput = req.body.item;
        const item = await prisma.item.update({
          where: { id },
          data: itemData,
        });

        if (!item) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: item });
      } catch (error) {
        console.log('[api] items/[id]/', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'DELETE':
      try {
        const deletedItem = await prisma.item.delete({ where: { id } });

        if (!deletedItem) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true });
      } catch (error) {
        console.log('[api] items/[id]/', error);
        return res.status(400).json({ isSuccess: false });
      }
      break;
    default:
      return res.status(400).json({ isSuccess: false });
  }
};
