import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className='text-red-500 uppercase text-center font-bold'>
      <h1>hELLO</h1>
      <a href="/api/auth/login">Login</a>
    </div>
  )
}

export default Home
