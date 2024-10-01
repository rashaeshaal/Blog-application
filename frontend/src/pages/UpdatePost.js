import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // For navigation after update
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the post data to pre-fill the form
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/accounts/postsviews/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to fetch post data');
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    
    try {
      await axios.put(`http://localhost:8000/api/accounts/postsviews/${id}/update/`, {
        title,
        content,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`  // Pass the token in the Authorization header
        }
      });
      navigate(`/posts/${id}`); // Redirect to the single post view after updating
    } catch (err) {
      setError('Failed to update post');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Update Post</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
