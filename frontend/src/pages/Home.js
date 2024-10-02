import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Base_url } from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6; // Assuming 6 posts per page

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Start loading when page changes
      try {
        const response = await axios.get(`${Base_url}accounts/postsviews/?page=${currentPage}`);
        setPosts(response.data.results || []);
        const totalPosts = response.data.count;
        setTotalPages(Math.ceil(totalPosts / postsPerPage));
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch posts');
      } finally {
        setLoading(false); // End loading after posts are fetched
      }
    };
  
    fetchPosts();
  }, [currentPage]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to the Blog</h1>
      <p className="text-lg text-center mb-6">Explore the latest blog posts</p>
  
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              {post?.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
              ) : (
                <p>No image available</p>
              )}
              <p className="text-gray-700 mb-4">{post.content.slice(0, 100)}...</p>
              <div className="text-right">
                <Link
                  to={`/posts/${post.id}`}
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No posts available</p>
      )}
  
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="mr-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className="ml-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
  
};

export default Home;
