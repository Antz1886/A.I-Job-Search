import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  loginWithEmail, 
  signUpWithEmail, 
  loginWithGoogle, 
  resetPassword 
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const user = await signUpWithEmail(email.trim(), password, name.trim());
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 1000);
      } else if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter your email and password.');
        }
        const user = await loginWithEmail(email.trim(), password);
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 800);
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your email address to reset password.');
        }
        await resetPassword(email.trim());
        setSuccessMsg('Password reset instructions sent to your email.');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication failed. Please try again.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'Invalid email or password. Please check your credentials or create a new account.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (msg.includes('auth/popup-closed-by-user')) {
        msg = 'Google sign-in popup was closed before completing.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      setSuccessMsg('Signed in with Google!');
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="bg-indigo-500/30 border border-indigo-400/40 p-2 rounded-xl text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">Career Cloud Sync</span>
              <h3 className="font-extrabold text-xl leading-tight">
                {mode === 'signup' && 'Create Your Career Account'}
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
            </div>
          </div>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            {mode === 'signup' && 'Sign up to personalize searches, sync your CV, and save applications to the cloud.'}
            {mode === 'signin' && 'Sign in to access your saved jobs, ATS audit records, and tailored pipelines.'}
            {mode === 'forgot' && 'Enter your email address and we will send you a recovery link.'}
          </p>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1.5">
            <button
              onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signin' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In */}
          {mode !== 'forgot' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 px-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or with email</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'signup' && 'Create Account & Sync'}
                  {mode === 'signin' && 'Sign In to Workspace'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Privacy & Cloud reassurance */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured with Firebase Auth & Cloud Firestore</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
