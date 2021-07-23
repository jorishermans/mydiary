import React from 'react';
import { Container } from "@material-ui/core";
import { Post } from './usePosts';

interface ISearchPostProps {
    posts: Post[]
}

const ShowPosts: React.FC<ISearchPostProps> = ({posts}) => {

  return (
    <Container component="main" maxWidth="xs">
        <div>
            {posts.map((post, index) => <div key={index}><h4>{post.title} - {post.date.toLocaleString()}</h4> <p>{post.description}</p></div>)}
        </div>
    </Container>
  );
}

export default ShowPosts;