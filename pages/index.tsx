import type { NextPage } from 'next'
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
