import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface MagicLinkLoginProps {
  onSuccess?: () => void;
}

export const MagicLinkLogin: React.FC<MagicLinkLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithMagicLink } = useAuth();

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      await signInWithMagicLink(email);
      setMessage('Check your email for the login link');
      onSuccess?.();
    } catch (error) {
      setMessage('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      
      <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Login Link'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 text-center text-sm ${
          message.includes('Check your email') 
            ? 'text-green-600' 
            : 'text-red-600'
        }`}>
          {message}
        </p>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>No passwords required!</p>
        <p>Just enter your email and click the link we send you.</p>
      </div>
    </div>
  );
};

export default MagicLinkLogin;
