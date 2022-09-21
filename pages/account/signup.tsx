import { Formik, FormikHelpers } from 'formik';
import { filter } from 'lodash';
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { ClientSafeProvider, getCsrfToken, getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SyntheticEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { authOptions } from '@api/auth/[...nextauth]';
import { BASIC_ERROR_MSG, MINIMUM_ACTIVITY_TIMEOUT } from '@constants';
import { Button, PasswordInput, TextInput } from '@frontstate-ui';
import { getSession } from '@lib/auth/session';


interface ISignupUser {
  username: string;
  email: string;
  password: string;
}

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Username is too short!')
    .max(20, 'Username is too long!')
    .required('Username is required'),

  email: Yup.string()
    .email('Please provide a valide email address.')
    .required('Email address is required.'),

  password: Yup.string()
    .min(8, 'Password is too short!')
    .required('Password is required.'),
});

const SignUp: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken, providers }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProviderSignIn = (provider: ClientSafeProvider) => {
    signIn(provider.id);
  };
  const handleSubmit = async (
    values: ISignupUser,
    actions: FormikHelpers<ISignupUser>
  ) => {
    const { username, email, password } = values;

    const toastId = toast.loading('Loading...');
    setIsSubmitting(true);

    try {
      const signInResponse = await signIn('app-sign-up', {
        redirect: false,
        username,
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
        actions.setFieldError('username', signInResponse.error);
        actions.setFieldError('email', signInResponse.error);
        actions.setFieldError('password', signInResponse.error);
      }

      if (signInResponse?.ok) router.push('/collections');
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
        <title>Sign up</title>
      </Head>
      <div className='sm:mx-auto sm:w-full sm:max-w-md text-center pt-4'>
        <a href='/'>
          <img
            className='h-16 mx-auto'
            src='/assets/gardian.png'
            alt='Gardian Logo'
          />
        </a>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <h1 className='text-xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate'>
            Recollective
          </h1>
        </div>
      </div>

      <div className='flex flex-col justify-center sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <h3 className='text-lg font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate'>
            Hello, there!
          </h3>
        </div>
        <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='py-2 px-4 mx-2 rounded-sm sm:px-10'>
            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
              }}
              validationSchema={SignupSchema}
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

                  <div>
                    <TextInput
                      type='text'
                      label='Username'
                      name='username'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      error={
                        touched.username && errors.username
                          ? errors.username
                          : undefined
                      }
                    />
                  </div>

                  <div className='mt-2'>
                    <TextInput
                      type='email'
                      label='Email Address'
                      name='email'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={
                        touched.email && errors.email ? errors.email : undefined
                      }
                    />
                  </div>

                  <div className='mt-2'>
                    <PasswordInput
                      label='Password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      name='password'
                      error={
                        touched.password && errors.password
                          ? errors.password
                          : undefined
                      }
                    />
                  </div>

                  <div className='mt-4 space-y-2 flex justify-center'>
                    <Button type='submit' variant='primary-filled' full>
                      <span className='text-lg'>
                        {isSubmitting ? 'Loading...' : 'Sign Up'}
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
            Already have an account?
            <Link href='/account/signin'>
              <a
                className='text-primary-200 px-1.5 hover:underline
             decoration-primary-200'>
                Sign In
              </a>
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
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
