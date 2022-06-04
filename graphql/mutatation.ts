import { gql } from "@apollo/client";

 export const ADD_POST = gql`
    mutation MyMutation(
        $image: String!
        $body: String!
        $subreddit_id: ID!
        $title: String!
        $username: String!
    ) {
        insertPost(
        image: $image
        body: $body
        subreddit_id: $subreddit_id
        title: $title
        username: $username
        ) {
            image
            body
            subreddit_id
            title
            username
            created_at
            id
        }
    }
 `

export const ADD_SUBREDDIT = gql`
mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
        id
        topic
        created_at
    }
}
`

export const ADD_COMMENT = gql`
mutation MyMutation($post_id: ID!, $username: String!, $text: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
        created_at
        id
        post_id
        text
        username
    }
}
`

export const SET_VOTE = gql`
mutation MyMutation($post_id: ID!, $username: String!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
        id
        created_at
        post_id
        upvote
        username
    }
}
`

