import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log(posts,"mdnbjdn c")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/accounts/postsviews/?page=${currentPage}`);
        setPosts(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
        
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    console.log(posts,"ddddddddddddddddddddddddddddddddddddddd")
  }, [currentPage]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to the Blog</h1>
      <p className="text-lg text-center mb-6">Explore the latest blog posts</p>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              {post?.image  && (
                <img
                  // src={`http://127.0.0.1:8000/${post?.image}`}
                  // http://localhost:8000/media/post_images/19-feet.webp"
              
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                
              )}
              console.log('huhukhjbjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjhu')
              <p className="text-gray-700 mb-4">{post.content.slice(0, 100)}...</p>
              <div className="text-right">
                <Link to={`/posts/${post.id}`} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No posts available</p>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="mr-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
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
