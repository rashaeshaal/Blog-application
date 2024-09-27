import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SinglePost = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${id}`); // Fetch post by ID
      const data = await response.json();
      setPost(data);
    };

    fetchPost();
  }, [id]);

  return (
    <div className="container mx-auto my-10 p-4">
      {post ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-6">{post.content}</p>
          <div className="text-gray-600">Tags: {post.tags ? post.tags.join(', ') : 'None'}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SinglePost;
