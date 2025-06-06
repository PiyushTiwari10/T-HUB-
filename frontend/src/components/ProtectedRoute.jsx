// create a component to protect routes that require authentication:
import React, { useEffect } from 'react';
// import { Navigate } from 'react-router-dom'; // Navigate from react-router-dom is not used in Next.js like this.
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; // For client-side redirection if needed

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to an auth page (e.g., /login or /auth)
    // Note: Your AppContent.jsx already handles rendering <Auth /> if not authenticated for its child routes.
    // This component might be redundant or need a different logic if AppContent is the primary gate.
    if (!loading && !isAuthenticated) {
      // router.push('/auth'); // Example redirect, adjust path as needed or rely on AppContent
      console.log("ProtectedRoute: User not authenticated, redirection would occur here or is handled by AppContent.");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // In Next.js, redirection is typically handled by middleware, server-side checks (getServerSideProps/layouts),
    // or client-side with router.push() as shown in the useEffect above.
    // AppContent.jsx already renders an <Auth /> component, so this path might not be hit often
    // if routes are nested within AppContent.
    // Returning null here or a placeholder while useEffect handles redirect.
    return null; 
  }

  return children;
}