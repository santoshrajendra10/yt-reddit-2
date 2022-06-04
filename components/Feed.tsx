import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post';

type Props = {
    topic1?: string
}

 function Feed({ topic1 }:Props) {
    const {data, error} = !topic1
    ? useQuery(GET_ALL_POSTS) 
    : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: { topic: topic1 },
      });

    console.log(error);

    const posts: Post[] = !topic1 ? data?.getPostList : data?.getPostListByTopic;

    return  <div className='mt-5 space-y-4'>
                {posts?.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
}

export default Feed