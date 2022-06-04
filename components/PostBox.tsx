import { LinkIcon, PhotographIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import Avatar from './Avatar';
import {useForm} from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutatation';
import client from '../appolo-client';
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';

type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

type Props = {
    subreddit?: string
};

function PostBox({subreddit}: Props) {
    const {data:session} = useSession();
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries:[
            GET_ALL_POSTS,
            'getPostList'
        ]
    });

    const [addSubreddit] = useMutation(ADD_SUBREDDIT);

    const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)

    const { 
        register, 
        handleSubmit, 
        setValue,  
        watch, 
        formState: { errors } 
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async(formData) => {
        console.log(formData);
        const notification = toast.loading('Creating new post...');

        try{
            //Query for the subreddit topic...
            const {data: {getSubredditListByTopic}} = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit
                }
            })

            const subRedditExists = getSubredditListByTopic.length > 0;

            if(!subRedditExists){
                //create a new subreddit!
                console.log('creating new subreddit');
                const {data: {insertSubreddit: newSubreddit}} = await addSubreddit({
                    variables:{
                        topic: subreddit || formData.subreddit
                    }
                })

                console.log('Creating post....', formData);
                const image = formData.postImage || '';

                const {data: {insertPost: newPost}} = await addPost({
                    variables: {
                        image: image,
                        body: formData.postBody,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
                console.log('New Post Added:',newPost);
            } else {
                // use the subreddit
                console.log('Using existing subreddit!');
                console.log(getSubredditListByTopic);
                const image = formData.postImage || '';

                const {data: {insertPost: newPost}} = await addPost({ 
                    variables:{
                        image: image,
                        body: formData.postBody,
                        subreddit_id: getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
                console.log('Post added to existing Reddit', newPost)
            }
        // After the post has been added
        setValue('postBody', '');
        setValue('postImage', '');
        setValue('postTitle', '');
        setValue('subreddit', '');
        
        toast.success('New post Created!', {
            id: notification
        })

        } catch(error){
            console.log(error);
            toast.error('whoops something went wrong!', {
                id: notification
            })
        }
    })

  return <form 
        onSubmit={onSubmit}
        className='sticky top-20 z-50 bg-white rounded-md border border-gray-300 p-2'>
      <div className='flex im-center space-x-3'>
          <Avatar/>
          <input
            {...register('postTitle', {required: true})}
            disabled={!session}
            className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
            type="text" 
            placeholder={
              session ? subreddit ? `Create a post in r/${subreddit}` : 'Create a post by entering a title' : 'Sign in to post'
            }/>
 
            <PhotographIcon 
            onClick={() => setImageBoxOpen(!imageBoxOpen)}
            className= {`h-6 mt-2 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`}/>
            <LinkIcon className='h-6 mt-2 text-gray-300'/>
      </div>
        {!!watch('postTitle') && (
          <div className='flex flex-col py-2'>
              <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Body:</p>
                <input
                className='m-2 flex-1 bg-blue-50 p-2 outline-none' 
                {...register('postBody')} 
                type="text" 
                placeholder='Text (Optional)' />
              </div>
              
              {
                !subreddit && (
                <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Subreddit:</p>
                <input
                className='m-2 flex-1 bg-blue-50 p-2 outline-none' 
                {...register('subreddit', {required: true})} 
                type="text" 
                placeholder='i.e. reactjs' />
                </div>
              )}

              {imageBoxOpen &&(
                <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Image URL:</p>
                <input
                    className='m-2 flex-1 bg-blue-50 p-2 outline-none' 
                    {...register('postImage')} 
                    type="text" 
                    placeholder='Optional...' />
                </div>
              )}

               {/* Error      */}
               {Object.keys(errors).length >0 && (
                   <div className='space-y-2 p-2 text-red-500'>
                       {errors.postTitle?.type === 'required' && (
                           <p>- A Post Title is required</p>
                       )}

                       {errors.subreddit?.type === 'required' && (
                           <p>- A Subreddit is required</p>
                       )}
                   </div>
               )}
               {!!watch('postTitle') && (
                   <button type='submit' 
                   className='w-full rounded-full bg-blue-400 p-2 text-white'>Create Post</button>
               )}
          </div>
      )}
  </form>
}
  
export default PostBox