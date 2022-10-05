import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // tid: template id
  const {
    query: { tid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(tid)) return res.status(400).json({ isSuccess: false });

  if (method === 'GET') {
    try {
      const template = await prisma.template.findUnique({ where: { id: tid } });

      if (!template) return res.status(400).json({ isSuccess: false });
      return res.status(200).json({ isSuccess: true, data: template });
    } catch (error) {
      console.log('[api] templates/[tid]', error);
      return res.status(400).json({ isSuccess: false });
    }
  } else {
    return res.status(400).json({ isSuccess: false });
  }
};
