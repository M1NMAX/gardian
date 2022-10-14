import { Button } from 'flowbite-react';
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
import { Divider, FloatingLabel, Header, Providers, Title } from '@features/account';
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
    <div className='h-screen flex flex-col justify-center py-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white'>
      <Head>
        <title>Sign in</title>
      </Head>
      <Header />
      <Title main='Welcome!' secondary='Login into your account.' />

      <div className='flex flex-col justify-center px-1 sm:px-6 lg:px-8'>
        <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='py-2 px-4 rounded-sm border'>
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

                  <FloatingLabel
                    type='email'
                    required
                    label='Email Address'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    isError={touched.email && !!errors.email}
                    errorMsg={errors.email}
                  />
                  <FloatingLabel
                    type='password'
                    required
                    label='Password'
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    isError={touched.password && !!errors.password}
                    errorMsg={errors.password}
                  />

                  <div className='mt-4 space-y-2 flex justify-center'>
                    <Button type='submit' color='success'>
                      <span className='text-lg'>
                        {isSubmitting ? 'Loading...' : 'Sign In'}
                      </span>
                    </Button>
                  </div>
                </form>
              )}
            </Formik>

            <section className='mt-4 text-center'>
              <Divider msg='Or Sign In with' />
              <Providers
                providers={providers}
                handleProviderSignIn={handleProviderSignIn}
              />
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
