import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Correct path

const Navbar = () => {
  const { user, setUser } = useUser(); // Get user and setUser from context
  const navigate = useNavigate();
  console.log('User in Navbar:', user); 
  

  const handleLogout = () => {
    setUser(null); // Clear user state on logout
    localStorage.removeItem('user'); // Clear user data from local storage
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to the login page after logout
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          BlogSite
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">Hi, {user.user.name}</span>
              <Link to={`/profile/${user.id}`} className="text-gray-300 hover:text-white">Profile</Link> {/* Pass user ID as URL param */}
              <Link to="/create-post" className="text-gray-300 hover:text-white">Create Post</Link>
              <button onClick={handleLogout} className="text-gray-300 hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
