import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Starting auth callback handling...');
        
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1);
        console.log('Hash fragment:', hash);
        
        if (!hash) {
          throw new Error('No hash fragment found in URL');
        }

        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        console.log('Access token present:', !!accessToken);
        console.log('Refresh token present:', !!refreshToken);

        if (!accessToken || !refreshToken) {
          throw new Error('Missing required tokens');
        }

        // Set the session using the hash fragment
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Session set successfully:', !!data.session);

        // Clear the hash fragment
        window.history.replaceState(null, '', window.location.pathname);

        // Get the current session to verify
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
        
        if (getSessionError) {
          console.error('Get session error:', getSessionError);
          throw getSessionError;
        }

        if (!session) {
          throw new Error('No session found after setting');
        }

        console.log('Session verified, redirecting to home...');
        
        // Redirect to home page after successful confirmation
        router.push('/');
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError(error.message);
        // Redirect to login page with error
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-[#4a6cf7] text-white rounded-lg hover:bg-[#3a5ce5] transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

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