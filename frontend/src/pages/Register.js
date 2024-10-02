import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',  // Update 'username' to 'name'
    email: '',
    password: '',
    imageUrl: 'no_dp',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${Base_url}accounts/register/`, formData);
      console.log('Registration successful:', response.data);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setFormData({ name: '', email: '', password: '' }); // Clear form fields

      setTimeout(() => {
        navigate('/login'); // Redirect to login after success
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (errors.email) {
          setErrorMessage(errors.email[0]); // Display email error
        } else if (errors.name) {
          setErrorMessage(errors.name[0]); // Display name error
        } else if (errors.password) {
          setErrorMessage(errors.password[0]); // Display password error
        } else {
          setErrorMessage('Registration failed: ' + (error.message || 'unknown error'));
        }
      } else {
        setErrorMessage('Registration failed: ' + (error.message || 'unknown error'));
      }
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Name</label> {/* Update label */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-colors duration-300 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Display error message */}
        {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
        {/* Display success message */}
        {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
