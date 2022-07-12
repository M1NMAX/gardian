import { getSession } from '@auth0/nextjs-auth0';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import collecting from '../public/undraw_collecting.svg';
import template from '../public/undraw_wireframing.svg';
import nextjsLogo from '../public/next-js-logo.png';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gardian</title>
      </Head>
      <Header />
      <main className='space-y-4  dark:bg-gray-700'>
        <div className='w-screen md:max-w-5xl mx-auto px-2 py-8 flex items-center'>
          <div className='basis-1/2 space-y-4 flex flex-col'>
            <p className='text-3xl font-bold uppercase dark:text-white'>
              Home <br /> for all &nbsp;
              <span className='text-green-400'>collections</span>
            </p>
            <p className='text-2xl font-medium text-gray-500 dark:text-gray-300'>
              Gardian let you store your items in collections
            </p>
            <Link href='/api/auth/login'>
              <a
                className='w-full max-w-xs  font-medium text-center text-gray-100 p-1 rounded 
              bg-green-500 hover:bg-green-400'>
                Try Gardian Free
              </a>
            </Link>
          </div>

          <div className='basis-1/2'>
            <Image src={collecting} objectFit='contain' alt='collecting' />
          </div>
        </div>

        <div className='w-screen md:max-w-lg mx-auto px-2 my-8 flex flex-col items-center'>
          <div>
            <p className='text-2xl font-bold dark:text-gray-100'>
              No need to start from scratch.
            </p>
            <p className='text-2xl font-bold dark:text-gray-100'>
              Your collection can start with a template.
            </p>
          </div>

          <div className='p-4'>
            <Image src={template} objectFit='contain' alt='wireframing' />
          </div>
        </div>
      </main>
      <footer className='py-10 flex flex-col items-center dark:bg-gray-900 dark:text-white'>
        <p>Copyright &copy; 2022</p>
        <p>
          Created with{' '}
          <span className='px-0.5 rounded-md dark:bg-white'>
            <Image src={nextjsLogo} height={15} width={15} alt='Nextjs logo' />
          </span>
          by M1NMAX
        </p>
      </footer>
    </>
  );
};

export default Home;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const sesssion = getSession(ctx.req, ctx.res);

  //Redirect user to collections page if user has a valid session
  if (sesssion) {
    return {
      redirect: {
        destination: '/collections',
        permanent: false,
      },
    };
  }
  return { props: {} as never };
}
