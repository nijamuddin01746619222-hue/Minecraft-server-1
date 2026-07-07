import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useSettingsStore } from '../store/useSettingsStore';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab as any);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSettingsStore();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Auto-assign admin if email is taher@gmail.com
      if (email.toLowerCase() === 'taher@gmail.com') {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          role: 'admin',
          email: email,
        }, { merge: true });
      }

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!minecraftUsername) {
      toast.error('Minecraft username is required');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const role = email.toLowerCase() === 'taher@gmail.com' ? 'admin' : 'user';
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        minecraftUsername,
        role,
        createdAt: new Date().toISOString(),
        totalSpent: 0
      });
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      setTab('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{'--color-primary': settings.themePrimary} as any}>
      <div className="w-full max-w-md bg-white retro-border border border-black rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-black text-center">
          <Link to="/" className="inline-block mb-4">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-12 mx-auto" />
            ) : (
              <div className="w-12 h-12 rounded bg-primary mx-auto flex items-center justify-center font-bold text-black text-xl">
                {settings.websiteName.charAt(0)}
              </div>
            )}
          </Link>
          <h2 className="text-2xl font-bold text-black">
            {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {tab === 'login' ? 'Login to continue to store' : tab === 'register' ? 'Join to start purchasing' : 'Enter email to receive reset link'}
          </p>
        </div>

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="flex border-b border-black">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-black'}`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-black'}`}
            >
              REGISTER
            </button>
          </div>
        )}

        {/* Forms */}
        <div className="p-6">
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-primary transition-colors"
                  placeholder="steve@example.com"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-600">Password</label>
                  <button type="button" onClick={() => setTab('forgot')} className="text-xs text-primary hover:underline">Forgot?</button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Minecraft Username</label>
                <input
                  type="text"
                  required
                  value={minecraftUsername}
                  onChange={(e) => setMinecraftUsername(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-primary transition-colors"
                  placeholder="Notch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-primary transition-colors"
                  placeholder="steve@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'REGISTER'}
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-primary transition-colors"
                  placeholder="steve@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'SEND RESET LINK'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setTab('login')} className="text-sm text-gray-600 hover:text-black transition-colors">
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
