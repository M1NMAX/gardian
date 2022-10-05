import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { hashPassword, verifyPassword } from '@lib/auth/passwords';
import { Session } from '@lib/auth/session';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/account/signin' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    //SIGN UP
    CredentialsProvider({
      id: 'app-sign-up',
      name: 'App Sign up',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Your username',
        },
        email: {
          label: 'Email Address',
          type: 'email',
          placeholder: 'john.doe@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your super secure password',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error('Invalid Credentials');
          }

          let maybeUser = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          });

          if (maybeUser) {
            throw new Error('User already exists');
          } else {
            maybeUser = await prisma.user.create({
              data: {
                name: credentials.username,
                email: credentials.email,
                password: await hashPassword(credentials.password),
              },
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
              },
            });
          }

          return {
            id: maybeUser.id,
            email: maybeUser.email,
            username: maybeUser.name,
            role: maybeUser.role,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
    //SIGN IN
    CredentialsProvider({
      id: 'app-login',
      name: 'App Login',
      credentials: {
        email: {
          label: 'Email Address',
          type: 'email',
          placeholder: 'john.doe@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your super secure password',
        },
      },
      async authorize(credentials) {
        try {
          const maybeUser = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          });

          if (!maybeUser) {
            throw new Error('Invalid Credentials');
          } else {
            if (!credentials?.password || !maybeUser.password) {
              throw new Error('Invalid Credentials');
            }

            const isValid = await verifyPassword(
              credentials.password,
              maybeUser.password
            );

            if (!isValid) {
              throw new Error('Invalid Credentials');
            }
          }

          return {
            id: maybeUser.id,
            email: maybeUser.email,
            username: maybeUser.name,
            role: maybeUser.role,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      };

      return sess;
    },
  },
};

export default NextAuth(authOptions);
