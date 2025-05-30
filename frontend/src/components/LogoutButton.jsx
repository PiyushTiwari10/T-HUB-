import React from 'react';
import { supabase } from '../supabaseClient';
import './LogoutButton.css';

const LogoutButton = () => {
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="logout-button" 
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <span className="loading-spinner"></span>
      ) : (
        <>
          <span className="logout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span>Logout</span>
        </>
      )}
    </button>
  );
};

export default LogoutButton;