import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@api/auth/[...nextauth]';
import { getSession } from '@lib/auth/session';
import prisma from '@lib/prisma';

//TODO:input validation
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //id: item id
  //pid: propertyId
  const {
    query: { id, pid },
    method,
  } = req;

  const session = await getSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (Array.isArray(id) || Array.isArray(pid)) {
    return res.status(400).json({ isSuccess: false });
  }

  switch (method) {
    case 'PUT': // upd property from properties array
      try {
        const { value } = req.body.property;

        const item = await prisma.item.update({
          where: { id },
          data: {
            properties: { updateMany: { where: { id: pid }, data: { value } } },
          },
        });

        if (!item) return res.status(400).json({ isSuccess: false });

        return res.status(200).json({ isSuccess: true, data: item });
      } catch (error) {
        console.log('[api] items/[id]/properties/[pid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    case 'DELETE':
      try {
        const item = await prisma.item.update({
          where: { id },
          data: { properties: { deleteMany: { where: { id: pid } } } },
        });

        if (!item) return res.status(400).json({ isSuccess: false });
        return res.status(200).json({ isSuccess: true });
      } catch (error) {
        console.log('[api] items/[id]/properties/[pid]', error);
        return res.status(400).json({ isSuccess: false });
      }

    default:
      return res.status(400).json({ isSuccess: false });
  }
};
