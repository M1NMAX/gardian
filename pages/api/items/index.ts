import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method } = req;
  if (method === 'POST') {
    try {
      const item = await prisma.item.create({ data: { ...req.body.item } });

      return res.status(201).json({ isSuccess: true, data: item });
    } catch (error) {
      console.log('[api] items/', error);
      return res.status(400).json({ isSuccess: false });
    }
  } else {
    return res.status(400).json({ isSuccess: false });
  }
};
