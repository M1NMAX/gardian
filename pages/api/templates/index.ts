import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const { method } = req;
  if (method === 'GET') {
    try {
      const templates = await prisma.template.findMany({
        orderBy: { name: 'asc' },
      });
      return res.status(200).json({ isSuccess: true, data: templates });
    } catch (error) {
      console.log('[api] templates/', error);
      return res.status(500).json({ isSuccess: false, message: error });
    }
  } else {
    return res.status(400).json({ isSuccess: false });
  }
};
