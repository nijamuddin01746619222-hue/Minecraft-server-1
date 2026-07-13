import React from "react";
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { ShieldAlert, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Admins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email?.toLowerCase() !== 'taher@gmail.com') {
      navigate('/admin/dashboard');
      return;
    }
    fetchAdmins();
  }, [user, navigate]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', 'in', ['admin', 'super_admin']));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setAdding(true);
    try {
      // Find user by email
      const q = query(collection(db, 'users'), where('email', '==', newAdminEmail.toLowerCase().trim()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        toast.error('User not found. They must sign in first.');
        setAdding(false);
        return;
      }

      const targetUserId = snap.docs[0].id;
      await updateDoc(doc(db, 'users', targetUserId), { role: 'admin' });
      toast.success('Admin added successfully!');
      setNewAdminEmail('');
      fetchAdmins();
    } catch (e) {
      console.error(e);
      toast.error('Failed to add admin');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, email: string) => {
    if (email.toLowerCase() === 'taher@gmail.com') {
      toast.error('Cannot remove the main admin.');
      return;
    }

    if (!confirm(`Are you sure you want to remove admin privileges from ${email}?`)) return;

    try {
      await updateDoc(doc(db, 'users', adminId), { role: 'user' });
      toast.success('Admin privileges removed');
      fetchAdmins();
    } catch (e) {
      console.error(e);
      toast.error('Failed to remove admin');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-pixel text-white">Manage Admins</h1>
      </div>

      <div className="bg-gray-900 rounded-xl border-2 border-black p-6 mb-8 max-w-xl">
        <h2 className="text-xl font-bold text-white mb-4">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="flex gap-4">
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="User Email Address"
            className="flex-1 bg-white border-2 border-black rounded-lg px-4 py-2 text-black font-bold outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-primary hover:bg-primary/80 text-black font-bold px-6 py-2 rounded-lg border-2 border-black flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {adding ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-2 font-bold">
          Note: The user must have signed into the site at least once.
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-black overflow-hidden max-w-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-black">
              <th className="p-4 font-bold text-black uppercase text-sm">Username</th>
              <th className="p-4 font-bold text-black uppercase text-sm">Email</th>
              <th className="p-4 font-bold text-black uppercase text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-bold text-black">{admin.minecraftUsername || 'N/A'}</td>
                <td className="p-4 text-sm text-gray-800 font-bold">{admin.email}</td>
                <td className="p-4 text-right">
                  {admin.email?.toLowerCase() !== 'taher@gmail.com' && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove Admin"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  {admin.email?.toLowerCase() === 'taher@gmail.com' && (
                    <span className="text-xs font-bold text-gray-500 uppercase px-2 py-1 bg-gray-100 rounded">Main Admin</span>
                  )}
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500 font-bold">No admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
