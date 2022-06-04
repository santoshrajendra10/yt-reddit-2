 import {gql} from '@apollo/client' 

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      comments {
        created_at
        id
        post_id
        text
        username
      }
      created_at
      id
      image
      subreddit_id
      title
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      username
      subreddit {
        created_at
        id
        topic
      }
    }
}`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      comments {
        created_at
        id
        post_id
        text
        username
      }
      created_at
      id
      image
      subreddit_id
      title
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      username
      subreddit {
        created_at
        id
        topic
      }
    }
}`

export const GET_POST_BY_ID = gql`
  query MyQuery($post_id: ID!) {
  getPostById(post_id: $post_id) {
    body
    created_at
    id
    image
    subreddit_id
    title
    username
    comments {
      created_at
      id
      post_id
      text
      username
    }
    subreddit {
      created_at
      id
      topic
    }
    votes {
      created_at
      id
      post_id
      upvote
      username
    }
  }
}
  `

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!){
    getSubredditListByTopic(topic: $topic) {
    topic
    created_at
    id
  }
}
 `

export const GET_ALL_VOTES_BY_POST_ID = gql`
query MyQuery($post_id: ID!){
    getVotesByPostId(post_id: $post_id) {
    created_at
    id
    post_id
    upvote
    username
  }
}
`

