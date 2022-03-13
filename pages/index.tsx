import { getSession } from '@auth0/nextjs-auth0'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gardian</title>
      </Head>
      <Header />
      <div className='text-red-500 uppercase text-center font-bold'>
        <h1>hELLO</h1>

      </div>
    </>
  )
}

export default Home

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const sesssion = getSession(ctx.req, ctx.res);

  //Redirect user to collections page if user has a valid session
  if (sesssion) {
    return {
      redirect: {
        destination: '/collections',
        permanent: false,
      },
    }
  }
  return { props: {} as never }

}
