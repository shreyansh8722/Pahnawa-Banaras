import React, { useContext } from 'react';
// --- REMOVED motion, AnimatePresence ---
import { X, User } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ThemeContext } from '../App';
import VettedLogoLight from '../assets/vetted-logo-light.png';
import VettedLogoDark from '../assets/vetted-logo-dark.png';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.06 6.21C12.06 13.52 17.53 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.6 28.71c-.48-1.45-.76-2.99-.76-4.6s.27-3.14.76-4.6l-8.06-6.21C.96 16.07 0 20.01 0 24s.96 7.93 2.56 11.11l8.04-6.4z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.47 0-11.94-4.02-13.9-9.42l-8.06 6.21C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LoginPromptModal({ open, onClose }) {
  const { theme } = useContext(ThemeContext);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  // --- RENDER INSTANTLY IF 'open' is true ---
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-[380px] p-6 pt-8 text-center relative overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <img
          src={theme === 'light' ? VettedLogoLight : VettedLogoDark}
          alt="Vetted Varanasi"
          className="h-20 w-auto mx-auto mb-4"
        />

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Join to continue
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Sign in to save favorites and book vetted locals.
        </p>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
          By continuing, you agree to our Terms & Privacy Policy.
        </div>
      </div>
    </div>
  );
}