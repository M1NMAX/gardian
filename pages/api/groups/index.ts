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
        const groups = await prisma.group.findMany({
          where: { userId },
          include: { collections: { select: { id: true } } },
          orderBy: { name: 'asc' },
        });

        return res.status(200).json({ isSuccess: true, data: groups });
      } catch (error) {
        console.log('[api] groups/', error);
        return res.status(500).json({ isSuccess: false, message: error });
      }

    case 'POST':
      try {
        const { name } = req.body;

        if (!name) throw Error('group name is required');

        const group = await prisma.group.create({
          data: { name, userId },
        });

        return res.status(201).json({ isSuccess: true, data: group });
      } catch (error) {
        console.log('[api] groups/', error);
        return res.status(400).json({ isSuccess: false });
      }

    default:
      return res.status(400).json({ isSuccess: false });
  }
};
