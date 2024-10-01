import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const SinglePost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // For navigation after deletion
  const [post, setPost] = useState(null); // State to store the post
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [userId, setUserId] = useState(null); // User ID state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8000/api/accounts/user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserId(response.data.id); // Assuming the API returns user ID
      } catch (err) {
        console.error('Failed to fetch user data');
      }
    };

    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/accounts/postsviews/${id}/`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post data');
      } finally {
        setLoading(false); // Set loading to false whether the fetch was successful or not
      }
    };

    fetchUserData();
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8000/api/accounts/postsviews/${id}/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/'); // Redirect to home after successful deletion
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!post) return <p className="text-center">No post found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.image && (
        <img
          src={`http://localhost:8000${post.image}`}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded-lg"
        />
      )}
      <p className="text-gray-700 mb-4">{post.content}</p>
      {post.userId === userId && ( // Check if the current user is the author of the post
        <>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Post
          </button>
          <Link
            to={`/posts/${post.id}/update`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Edit Post
          </Link>
        </>
      )}
    </div>
  );
};

export default SinglePost;
