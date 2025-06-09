import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        // Check if we have the access token
        if (params.get('access_token')) {
          // Set the session using the hash fragment
          const { error } = await supabase.auth.setSession({
            access_token: params.get('access_token'),
            refresh_token: params.get('refresh_token'),
          });

          if (error) throw error;

          // Clear the hash fragment
          window.history.replaceState(null, '', window.location.pathname);

          // Redirect to home page after successful confirmation
          router.push('/');
        } else {
          throw new Error('No access token found');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        // Redirect to login page with error
        router.push('/login?error=confirmation_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#4a6cf7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Confirming your email...</h1>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
} 