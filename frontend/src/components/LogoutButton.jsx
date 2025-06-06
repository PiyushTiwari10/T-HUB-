import React from 'react';
import { supabase } from '../supabaseClient';

const LogoutButton = ({ className = '' }) => {
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

  // Default button styles
  const defaultButtonStyles = "flex items-center justify-center gap-2 py-2 px-4 bg-[#4a6cf7] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#3a5ce5] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none";

  return (
    <button 
      className={`${defaultButtonStyles} ${className}`}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-[rgba(255,255,255,0.3)] rounded-full border-t-white animate-spin"></span>
      ) : (
        <>
          <span className="flex items-center">
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