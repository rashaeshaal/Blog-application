import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '../api'; // Import the function from the utility file

const BlogPosts = () => {
  const [posts, setPosts] = useState([]); // State to store blog posts
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  // Use the useEffect hook to call fetchBlogPosts when the component is mounted
  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchBlogPosts(); // Call the API function
        setPosts(data); // Set the data in the state
        setLoading(false); // Stop loading
      } catch (error) {
        setError('Failed to fetch posts'); // Handle errors
        setLoading(false); // Stop loading
      }
    };

    getPosts();
  }, []); // Empty dependency array to run only once when the component is mounted

  if (loading) return <div>Loading...</div>; // Show loading message
  if (error) return <div>{error}</div>; // Show error message

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPosts;
