import React, { useState } from 'react';
import { createBlogPost } from '../api'; // Adjust the import path if necessary

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    try {
      const response = await createBlogPost(formData);
      setSuccessMessage('Post created successfully!');
      setFormData({ title: '', content: '', tags: '' }); // Reset the form
    } catch (err) {
      setError('Failed to create the post. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Create Blog Post</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags:</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
