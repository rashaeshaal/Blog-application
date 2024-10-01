import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; 
import SinglePost from './pages/SinglePost';
import Navbar from './components/Navbar';
import BlogPosts from './components/BlogPosts'; 
import { UserProvider } from './context/UserContext';
import CreatePost from './components/CreatePost'; 
import UpdatePost from './pages/UpdatePost';
function App() {
  return (
    <UserProvider> {/* Wrap your application with UserProvider */}
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<BlogPosts />} /> {/* Display BlogPosts on /posts */}
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/posts/:id/update" element={<UpdatePost />} />
            <Route path="/profile/:userId" element={<Profile />} /> {/* Corrected route for Profile */}
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />  {/* Route for Login */}
            <Route path="/register" element={<Register />} />  {/* Route for Register */}
          </Routes>
        </main>
      </div>
    </Router>
    </UserProvider>
  );
}

  
    
export default App;
