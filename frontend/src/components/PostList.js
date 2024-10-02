// PostList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Base_url } from '../api';

const PostList = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${Base_url}posts/?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      setPosts(response.data.results);
    } catch (error) {
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Tags: {post.tags}</p>
          {/* Add buttons for view, edit, delete */}
        </div>
      ))}
      <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(prev => prev + 1)}>Next</button>
    </div>
  );
};

export default PostList;

