import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Base_url } from '../api';

const EditPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate(); // For navigation after editing
  const [post, setPost] = useState({ title: '', content: '', image: null }); // Post state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${Base_url}accounts/postsviews/${id}/`);
        setPost(response.data); // Fill the form with existing data
      } catch (err) {
        setError('Failed to fetch post data');
        console.error('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content);
      if (post.image) {
        formData.append('image', post.image);
      }

      await axios.patch(`${Base_url}accounts/postsviews/${id}/update/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/posts/${id}/`); // Redirect to the updated post
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err.message);
    }
  };

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setPost({
      ...post,
      image: e.target.files[0]
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
