import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAdminLoggedIn } = useAuthStore();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (password === 'taher1234') {
      localStorage.setItem('adminSession', 'true');
      setAdminLoggedIn(true);
      toast.success('Admin access granted');
      navigate('/admin/dashboard');
    } else {
      toast.error('Incorrect Password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm bg-white retro-border border border-black rounded-xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-black">Admin Panel</h2>
          <p className="text-gray-600 text-sm mt-1">Enter password to access dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-black text-center tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 rounded-lg transition-colors"
          >
            LOGIN TO ADMIN
          </button>
        </form>
      </div>
    </div>
  );
}
