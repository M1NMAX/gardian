import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  DefaultSession,
  NextAuthOptions,
  unstable_getServerSession,
} from 'next-auth';

type DefaultSessionUser = NonNullable<DefaultSession['user']>;

type SessionUser = DefaultSessionUser & {
  id: string;
  role: string;
};

export type Session = DefaultSession & {
  user: SessionUser;
};

export async function getSession(
  ...arg:
    | [
        GetServerSidePropsContext['req'],
        GetServerSidePropsContext['res'],
        NextAuthOptions
      ]
    | [NextApiRequest, NextApiResponse, NextAuthOptions]
): Promise<Session | null> {
  const session = await unstable_getServerSession(arg[0], arg[1], arg[2]);

  // that these are equal are ensured in `[...nextauth]`'s callback
  return session as Session | null;
}
