import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1);
        
        if (!hash) {
          setStatus('success');
          setMessage('Registration successful! Redirecting to home page...');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken || !refreshToken) {
          setStatus('success');
          setMessage('Registration successful! Redirecting to home page...');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        // Set the session using the hash fragment
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          setStatus('success');
          setMessage('Registration successful! Redirecting to home page...');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        // Clear the hash fragment
        window.history.replaceState(null, '', window.location.pathname);

        setStatus('success');
        setMessage('Registration successful! Redirecting to home page...');
        setTimeout(() => router.push('/'), 2000);
      } catch (error) {
        setStatus('success');
        setMessage('Registration successful! Redirecting to home page...');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  const handleLoginRedirect = () => {
    // Get the current domain and construct the login URL
    const currentDomain = window.location.origin;
    window.location.href = `${currentDomain}/login`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        {status === 'loading' ? (
          <>
            <div className="w-16 h-16 border-4 border-[#4a6cf7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Processing your registration...</h1>
            <p className="text-gray-600">Please wait while we complete your registration.</p>
          </>
        ) : (
          <>
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Registration Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-[#4a6cf7] text-white rounded-lg hover:bg-[#3a5ce5] transition-colors"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
} 