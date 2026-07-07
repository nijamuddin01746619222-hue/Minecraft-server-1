import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { formatPrice } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';
import toast from 'react-hot-toast';
import { Shield, ShieldAlert, Trash2 } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettingsStore();

  const fetchUsers = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'users'));
    const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setUsers(fetched);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (e) {
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to entirely delete this user data? (Authentication must be deleted via Firebase Console)')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        toast.success('User data deleted');
        fetchUsers();
      } catch (e) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-pixel text-black mb-8">Users</h1>
      <div className="retro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Minecraft Username</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Role</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Total Spent</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-black">{user.minecraftUsername || 'N/A'}</td>
                  <td className="p-4 text-sm text-gray-800">{user.email}</td>
                  <td className="p-4">
                    <select 
                      value={user.role || 'user'} 
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="retro-border px-2 py-1 bg-white text-xs font-bold uppercase cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="banned">Banned</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-black font-bold">
                    {formatPrice(user.totalSpent || 0, settings.currency)}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => deleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Data">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-700">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
