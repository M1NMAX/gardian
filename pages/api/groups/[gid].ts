import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // gid: short for groupId
  const {
    query: { gid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(gid)) return res.status(400).json({ isSuccess: false });

  switch (method) {
    case 'GET':
      try {
        const group = await prisma.group.findUnique({ where: { id: gid } });

        if (!group) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: group });
      } catch (error) {
        console.log('[api] groups/[gid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'PUT':
      try {
        const group = await prisma.group.update({
          where: { id: gid },
          data: { ...req.body },
        });

        if (!group) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true, data: group });
      } catch (error) {
        console.log('[api] groups/[gid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'DELETE':
      try {
        const deletedGroup = await prisma.group.delete({ where: { id: gid } });
        if (!deletedGroup) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true });
      } catch (error) {
        console.log('[api] groups/[gid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    default:
      return res.status(400).json({ isSuccess: false });
  }
};
