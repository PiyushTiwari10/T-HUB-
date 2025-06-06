import React from 'react';
import { useAuth } from '../context/AuthContext';
import Auth from './Auth';

// AppContent now primarily handles auth state and loading for its children.
// The actual page layout (Navbar, main container) will be in _app.jsx.
function AppContent({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  // If authenticated, render the page content passed as children
  return <>{children}</>;
}

export default AppContent;