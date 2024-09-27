import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api'; // API functions
import { useUser } from '../context/UserContext'; // Correct path to user context

const Profile = () => {
  const { user, setUser } = useUser(); // Destructure setUser to update user in context
  const [profileData, setProfileData] = useState({ name: '', email: '', profile_picture: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // Control edit/view mode

  // Fetch the profile data when the component is mounted
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(); // Fetch data from API
        setProfileData(data); // Set profile data
      } catch (err) {
        setError('Error fetching profile data.');
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileData((prevData) => ({ ...prevData, profile_picture: file }));
  };

  // Save updated profile
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('profile_picture', profileData.profile_picture); // Add file to FormData
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);

    setLoading(true);
    try {
      const updatedUser = await updateUserProfile(formData); // Update the API call to use FormData
      setUser(updatedUser); // Update user in context
      setEditMode(false); // Exit edit mode
    } catch (err) {
      setError('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 p-5">
      <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {profileData ? (
        <>
          {editMode ? (
            <div>
              {/* Edit mode form */}
              <label className="block mb-2 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 mb-4 w-full"
              />
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 mb-4 w-full"
              />
              <label className="block mb-2 font-medium">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded p-2 mb-4 w-full"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="ml-4 text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* View mode */}
              <p className="text-lg font-medium">Name: {profileData.name}</p>
              <p className="text-lg font-medium">Email: {profileData.email}</p>
              {profileData.profile_picture && (
                <img
                  src={URL.createObjectURL(profileData.profile_picture)} // Show selected picture
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mt-4"
                />
              )}
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Edit Profile
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
