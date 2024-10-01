import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Adjust the path according to your structure
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user,login,updateUser } = useUser();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({ name: '', profile_picture: null });

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if the user is not authenticated
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts/profiles/', {
          headers: {
            'Authorization': `Bearer ${user.token}`, // Include the token for authenticated requests
          },
        });

        console.log(response.data,"HEYYYYYYYYYYYYYYYYYYYYYYYYYYY")
        console.log(response.data.results[6],"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
          


        setProfileData(response.data);
        setUpdatedData({ name: response.data.name, profile_picture: response.data?.results?.profile_picture });
        console.log(profileData,"progile imageeeeeeeeeeeeeeeeeeeeeeeeeee")
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.'); // Handle unauthorized error
        } else {
          setError('Failed to fetch profile data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setUpdatedData((prevData) => ({ ...prevData, profile_picture: e.target.files[0] }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      // Create FormData for the profile update
      const formData = new FormData();
      formData.append('name', updatedData.name);
      if (updatedData.profile_picture) {
        formData.append('profile_picture', updatedData.profile_picture);
      }
  
      // Send PATCH request to update profile
      const response = await axios.patch('http://localhost:8000/api/accounts/profiles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`,
        },
      });
  
      // Log successful update
      console.log('Profile updated successfully', response.data);
      
      // Update profile data in local state
      // setProfileData(response.data);
      setIsEditing(false);
      updateUser(response.data);
  
      // Update user context and local storage
      // const updatedUser = {
      //   ...user,
      //   name: response.data.name,
      //   profile_picture: response.data.profile_picture,
      // };
      // login(updatedUser); // Update user context
      // localStorage.setItem('user', JSON.stringify(updatedUser)); // Optional: update local storage
    } catch (error) {
      console.error('Failed to update profile. Please try again later.', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };
  
  

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!profileData) {
    return <div className="text-center">No profile data available.</div>;
  }

  // Construct the profile picture URL
  const profilePictureUrl = profileData.profile_picture 
    ? `http://localhost:8000${profileData.profile_picture}` // Ensure to prefix the media URL correctly
    : 'default-avatar.png'; // Use a default image if none exists

  return (
    <div className="container mx-auto p-10 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg shadow-lg">
      <div className="bg-white rounded-lg p-8 shadow-lg mb-10 transition-all hover:shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src={profilePictureUrl}
            alt={`${user.user.name}'s Profile`}
            className="w-36 h-36 rounded-full border-4 border-blue-500 mb-6 shadow-lg transition-transform transform hover:scale-110"
          />
          <h1 className="text-5xl font-extrabold text-gray-800 mb-3">{user.user.name}</h1>
          {/* <p className="text-gray-600 text-sm italic">{user.bio || ''}</p> */}
        </div>

        <div className="border-t border-gray-300 pt-6">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Profile Information</h2>
          <p className="text-lg text-gray-600">
            <span className="font-medium">Email:</span> {user.user.email}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-medium">Name:</span> {user.user.name}
          </p>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="mt-8">
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleChange}
              className="border p-4 rounded-lg mb-4 w-full shadow-md focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Update Name"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-4 rounded-lg mb-4 w-full shadow-md focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 mt-6"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
