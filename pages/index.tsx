import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import PostBox from '../components/PostBox'
import Feed from '../components/Feed'

const Home: NextPage = () => {
  return (
    <div className='max-w-5xl my-7 mx-auto'>
      <Head>
        <title>Reddit 2.0 Clone</title>
      </Head>

      <PostBox/>

      <div className='flex'>
        {/* feed */}
        <Feed/>
      </div>
    </div>
  )
}

export default Home
