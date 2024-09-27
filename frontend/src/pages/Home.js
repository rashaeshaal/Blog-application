import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to the Blog</h1>
      <p className="text-lg text-center mb-6">This is the home page styled with Tailwind CSS.</p>
      
      {/* Example Button */}
      <div className="text-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Read Latest Blogs
        </button>
      </div>
    </div>
  );
};

export default Home;
