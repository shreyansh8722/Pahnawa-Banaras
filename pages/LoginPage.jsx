import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

// --- VALIDATION SCHEMAS ---
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema; // Same for now, can extend later

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // React Hook Form Setup
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema)
  });

  // Reset form when switching modes
  useEffect(() => {
    reset();
    setError(null);
    setSuccessMsg(null);
  }, [mode, reset]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const ensureUserProfile = async (firebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        favorites: [],
        cart: [],
        createdAt: new Date()
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'forgot') {
        if (!data.email) { setError("Please enter your email"); setLoading(false); return; }
        await sendPasswordResetEmail(auth, data.email);
        setSuccessMsg("Password reset link sent to your email.");
        setLoading(false);
        return;
      }

      let userCredential;
      if (mode === 'login') {
        userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await ensureUserProfile(userCredential.user);
      }
      // Navigation happens in useEffect when user state changes
    } catch (err) {
      let msg = err.message.replace('Firebase: ', '');
      if (msg.includes('auth/invalid-credential')) msg = "Incorrect email or password.";
      if (msg.includes('auth/email-already-in-use')) msg = "Email already registered. Please log in.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserProfile(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-20 px-4 relative">
        <div className="w-full max-w-md relative">
          
          <Link to="/" className="absolute -top-12 left-0 text-gray-400 hover:text-black flex items-center gap-2 text-sm font-medium transition-colors">
             <ArrowLeft size={16} /> Return to Store
          </Link>

          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-[#B08D55] mb-2">
              {mode === 'forgot' ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Join the Family'}
            </h1>
            <p className="text-gray-500 text-sm tracking-wide uppercase">
              {mode === 'forgot' ? 'We will send you a recovery link' : mode === 'login' ? 'Access your wishlist & orders' : 'Begin your royal journey'}
            </p>
          </div>

          <div className="bg-[#F9F9F9] p-8 rounded-sm shadow-sm border border-gray-100">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-sm border border-red-100 mb-6">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            {successMsg && (
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 p-3 rounded-sm border border-green-100 mb-6">
                <CheckCircle size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("email")}
                    className={`w-full pl-10 pr-3 py-3 border rounded-sm text-sm focus:outline-none focus:border-[#B08D55] ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email.message}</p>}
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      {...register("password")}
                      className={`w-full pl-10 pr-3 py-3 border rounded-sm text-sm focus:outline-none focus:border-[#B08D55] ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.password.message}</p>}
                  
                  {mode === 'login' && (
                    <div className="flex justify-end mt-2">
                      <button type="button" onClick={() => setMode('forgot')} className="text-xs text-gray-400 hover:text-[#B08D55]">Forgot Password?</button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#8C6A48] transition-all disabled:opacity-70 flex justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : (mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
            
            {mode !== 'forgot' && (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Or</span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white border border-gray-200 text-brand-dark py-3 text-sm font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="font-bold">G</span> Continue with Google
                </button>
              </>
            )}

            <p className="text-center mt-6 text-sm text-gray-500">
              {mode === 'forgot' ? (
                <button onClick={() => setMode('login')} className="text-[#B08D55] font-bold hover:underline">Back to Login</button>
              ) : (
                <>
                  {mode === 'login' ? "New to Pahnawa?" : "Already have an account?"}
                  <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="ml-1 text-[#B08D55] font-bold hover:underline">
                    {mode === 'login' ? "Sign Up" : "Sign In"}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}