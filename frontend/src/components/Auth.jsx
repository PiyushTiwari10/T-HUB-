// Authentication UI Components
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Handle email confirmation
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

    // Check for email confirmation in URL
    if (window.location.hash) {
      handleEmailConfirmation();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setMessage('Login successful!');
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage('');
      
      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      setMessage('Check your email for the confirmation link! The link will expire in 24 hours.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setLoading(true);
      setMessage('');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      setMessage('Confirmation email resent! Please check your inbox.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
      <div className="w-full max-w-[450px] bg-white rounded-xl shadow-lg p-10 transition-transform duration-300 ease-in-out hover:-translate-y-1 max-[480px]:p-6">
        <div className="text-center mb-8">
          <h1 className="text-[2rem] text-[#333] mb-2 font-bold max-[480px]:text-[1.75rem]">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-[#666] text-[0.95rem] leading-normal">
            {isSignUp 
              ? 'Sign up to discover the best tech stacks for your projects' 
              : 'Login to access your saved tech stacks and preferences'}
          </p>
        </div>
        
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-semibold text-[#444] text-[0.9rem]">Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full py-3 px-4 border-2 border-[#e1e5ee] rounded-lg text-base transition-all duration-300 bg-[#f9fafc] focus:border-[#4a6cf7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,108,247,0.1)] focus:outline-none placeholder:text-[#aab]"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-semibold text-[#444] text-[0.9rem]">Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-3 px-4 border-2 border-[#e1e5ee] rounded-lg text-base transition-all duration-300 bg-[#f9fafc] focus:border-[#4a6cf7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,108,247,0.1)] focus:outline-none placeholder:text-[#aab]"
              />
            </div>
          </div>
          
          <button type="submit" className="w-full py-[0.9rem] bg-[#4a6cf7] text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-4 relative hover:bg-[#3a5ce5] hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none" disabled={loading}>
            {loading ? (
              <span className="inline-block w-5 h-5 border-[3px] border-[rgba(255,255,255,0.3)] rounded-full border-t-white animate-spin"></span>
            ) : (
              isSignUp ? 'Create Account' : 'Login'
            )}
          </button>
          
          {message && (
            <div className={`mt-4 p-3 px-4 rounded-lg text-[0.9rem] text-center ${message.includes('Error') ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]' : 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]'}`}>
              {message}
              {message.includes('Check your email') && (
                <button
                  onClick={handleResendConfirmation}
                  className="block w-full mt-2 text-[#4a6cf7] hover:underline"
                >
                  Resend confirmation email
                </button>
              )}
            </div>
          )}
        </form>
        
        <div className="mt-8 text-center text-[#666]">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              className="bg-transparent border-none text-[#4a6cf7] font-semibold cursor-pointer p-0 text-inherit transition-colors duration-300 hover:text-[#3a5ce5] hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}