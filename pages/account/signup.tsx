import { filter } from 'lodash';
import {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
    NextPage
} from 'next';
import {
    ClientSafeProvider,
    getCsrfToken,
    getProviders,
    signIn
} from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SyntheticEvent, useState } from 'react';
import { authOptions } from '@api/auth/[...nextauth]';
import { LOADING_MINIMUM_ACTIVITY_TIMEOUT } from '@constants';
import { Button } from '@frontstate-ui';
import { getSession } from '@lib/auth/session';


const SignUp: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken, providers }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleProviderSignIn = (providerId: string) => {
    signIn(providerId);
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const signInResponse = await signIn('app-sign-up', {
        redirect: false,
        username: username,
        email: email,
        password: password,
      });

      setTimeout(() => {
        setIsSubmitting(false);
      }, LOADING_MINIMUM_ACTIVITY_TIMEOUT);

      if (signInResponse?.ok) router.push('/collections');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };
  return (
    <div className='h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className='sm:mx-auto sm:w-full sm:max-w-md text-center py-2'>
        <a href='/'>
          <img
            className='h-16 mx-auto'
            src='/assets/gardian.png'
            alt='Gardian Logo'
          />
        </a>
      </div>

      <div className=' flex flex-col justify-center sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <h1 className='text-xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate'>
            Sign Up
          </h1>
        </div>
        <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='py-2 px-4 mx-2 rounded-sm sm:px-10'>
            <form className='text-center my-12' onSubmit={handleSubmit}>
              <input
                name='csrfToken'
                type='hidden'
                defaultValue={csrfToken}
                hidden
              />
              <div className=''>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-neutral-400'>
                  Username
                </label>
                <div className='mt-1'>
                  <input
                    id='usename'
                    name='usename'
                    type='text'
                    autoComplete='text'
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='appearance-none w-full font-medium py-3 
                    border-b border-t-0 border-l-0 border-r-0 border-dashed outline-none 
                    text-xl text-center leading-6 bg-transparent placeholder-gray-500 
                    focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out'
                  />
                </div>
              </div>
              <div className='mt-6'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-neutral-400'>
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='appearance-none w-full font-medium py-3 
                    border-b border-t-0 border-l-0 border-r-0 border-dashed outline-none 
                    text-xl text-center leading-6 bg-transparent placeholder-gray-500 
                    focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out'
                  />
                </div>
              </div>

              <div>
                <div className='mt-6'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-neutral-400'>
                    Password
                  </label>
                </div>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    minLength={12}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='appearance-none w-full font-medium py-3 border-b border-t-0 border-l-0 border-r-0 border-dashed outline-none text-xl text-center leading-6 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out'
                  />
                </div>
              </div>

              <div className='mt-6 space-y-2 flex justify-center'>
                <Button type='submit' variant='primary-filled' full>
                  <span className='text-lg'>
                    {isSubmitting ? 'Loading...' : 'Sign Up'}
                  </span>
                </Button>
              </div>
            </form>
            <section className='mt-4 text-center'>
              <div className='flex flex-col mb-3'>
                <hr className='h-0 border-t mt-1' />
                <div className='-mt-3 text-sm text-center'>
                  <span className='px-2 bg-white text-secondary'>
                    Or Sign up with
                  </span>
                </div>
              </div>

              <div className='flex flex-col'>
                {providers.map((provider: ClientSafeProvider) => {
                  return (
                    <Button
                      key={provider.id}
                      type='button'
                      onClick={() => handleProviderSignIn(provider.id)}
                      variant='secondary-filled'>
                      <img
                        className='w-4 h-4'
                        src={`/assets/${provider.id}.png`}
                      />
                      <span className='text-lg'>{provider.name}</span>
                    </Button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { permanent: false, destination: '/' } };
  }

  const csrfToken = await getCsrfToken({ req: context.req });

  const providers = filter(await getProviders(), (provider) => {
    return provider.type !== 'credentials';
  });

  return {
    props: { csrfToken, providers },
  };
}
