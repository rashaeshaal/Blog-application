import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import the User context
import axios from 'axios';

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  // State for form data and error handling
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/handlelogin/', formData);
      
      // Log the entire response object to debug
      console.log('API Response:', response.data);

      const userData = response.data.user;
      console.log('User Data:', userData);
      const token = response.data.token;  // Assuming response has user data

      // Check if the response contains a token and user data
      if (userData && token) {
        console.log('User Data from API:', userData); 
        setUser(userData); // Update the user in context
        localStorage.setItem('token', token); // Store the token
        navigate('/'); // Redirect to the home page after successful login
      } else {
        setError('No token or user data received. Please check your credentials.');
      }
    } catch (err) {
      // Improved error handling based on response
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Login failed. Please try again later.');
      }
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-300`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        <p className="mt-6 text-gray-600 text-center">
          New user?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
