import { Label, TextInput } from 'flowbite-react';
import { Formik, FormikHelpers } from 'formik';
import { filter } from 'lodash';
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { ClientSafeProvider, getCsrfToken, getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { authOptions } from '@api/auth/[...nextauth]';
import { BASIC_ERROR_MSG, MINIMUM_ACTIVITY_TIMEOUT } from '@constants';
import { Button, PasswordInput } from '@frontstate-ui';
import { getSession } from '@lib/auth/session';


interface ISigninUser {
  email: string;
  password: string;
}

const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please provide a valide email address.')
    .required('Email address is required.'),

  password: Yup.string().required('Password is required.'),
});

const SignIn: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken, providers }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProviderSignIn = (provider: ClientSafeProvider) => {
    signIn(provider.id);
  };
  const handleSubmit = async (
    values: ISigninUser,
    actions: FormikHelpers<ISigninUser>
  ) => {
    const { email, password } = values;

    const toastId = toast.loading('Loading...');
    setIsSubmitting(true);

    try {
      const signInResponse = await signIn('app-login', {
        redirect: false,
        email,
        password,
      });

      setTimeout(() => {
        toast.dismiss(toastId);
        setIsSubmitting(false);
      }, MINIMUM_ACTIVITY_TIMEOUT);

      if (signInResponse && signInResponse.ok) {
        router.push('/collections');
        toast.success('Success');
      } else if (signInResponse && signInResponse.error) {
        toast.error(signInResponse.error);
        actions.setFieldError('email', signInResponse.error);
        actions.setFieldError('password', signInResponse.error);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      toast.dismiss(toastId);
      toast.error(BASIC_ERROR_MSG);
    }
  };
  return (
    <div className='h-screen flex flex-col justify-center py-4 sm:px-6 lg:px-8'>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className='sm:mx-auto sm:w-full sm:max-w-md text-center pt-4'>
        <Link href='/'>
          <a>
            <img
              className='h-16 mx-auto'
              src='/assets/gardian.png'
              alt='Gardian Logo'
            />
          </a>
        </Link>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <h1 className='text-xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate'>
            Recollective
          </h1>
        </div>
      </div>

      <div className='flex flex-col justify-center sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <h3 className='text-lg font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate'>
            Wellcome!
          </h3>
        </div>
        <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='py-2 px-4 mx-2 rounded-sm sm:px-10'>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={SigninSchema}
              onSubmit={handleSubmit}>
              {({
                handleSubmit,
                touched,
                errors,
                handleChange,
                handleBlur,
                values,
              }) => (
                <form className='my-2' onSubmit={handleSubmit}>
                  <input
                    name='csrfToken'
                    type='hidden'
                    defaultValue={csrfToken}
                    hidden
                  />

                  <div className='mt-2'>
                    <div className='relative z-0'>
                      <input
                        id='email'
                        type='email'
                        name='email'
                        className='block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        required
                      />
                      <label
                        htmlFor='email'
                        className='absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Email Address
                      </label>
                    </div>
                    {touched.email && errors.email && (
                      <p
                        id='standard_error_help'
                        className='mt-2 text-xs text-center font-medium text-danger-200'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className='mt-2'>
                    <div className='relative z-0'>
                      <input
                        id='password'
                        type='password'
                        name='password'
                        className='block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        required
                      />
                      <label
                        htmlFor='password'
                        className='absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Password
                      </label>
                    </div>
                    {touched.password && errors.password && (
                      <p
                        id='standard_error_help'
                        className='mt-2 text-xs text-center font-medium text-danger-200'>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className='mt-4 space-y-2 flex justify-center'>
                    <Button type='submit' variant='primary-filled' full>
                      <span className='text-lg'>
                        {isSubmitting ? 'Loading...' : 'Sign In'}
                      </span>
                    </Button>
                  </div>
                </form>
              )}
            </Formik>

            <section className='mt-4 text-center'>
              <div className='flex flex-col mb-3'>
                <hr className='h-0 border-t mt-1' />
                <div className='-mt-3 text-sm text-center'>
                  <span className='px-2 bg-white text-secondary'>
                    Or Sign in with
                  </span>
                </div>
              </div>

              <div className='flex flex-col'>
                {providers.map((provider: ClientSafeProvider) => {
                  return (
                    <Button
                      key={provider.id}
                      type='button'
                      onClick={() => handleProviderSignIn(provider)}
                      variant='secondary-filled'>
                      <img
                        className='w-5 h-5'
                        src={`/assets/${provider.id}.png`}
                      />
                      <span className='text-lg mx-auto'>{provider.name}</span>
                    </Button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <p className='font-medium'>
            Don&apos;t have an account?
            <Link href='/account/signup'>
              <a
                className='text-primary-200 px-1.5 hover:underline
               decoration-primary-200'>
                Sign Up
              </a>
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default SignIn;

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
