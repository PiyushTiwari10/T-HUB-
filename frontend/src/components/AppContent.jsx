import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import TechList from './TechList';
import TechDetails from './TechDetails';
import Auth from './Auth';
import About from './About';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, show the Auth component
  if (!isAuthenticated) {
    return <Auth />;
  }

  // If authenticated, show the main application with routes
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<TechList />} />
          <Route path="/tech/:id" element={<TechDetails />} />
          <Route path="/about" element={<About />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default AppContent;