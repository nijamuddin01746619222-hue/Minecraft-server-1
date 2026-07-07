import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Coupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 0,
    maxUses: 0,
    expiresAt: '',
    oncePerUser: false,
    enabled: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'coupons'));
    setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon?: any) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        maxUses: coupon.maxUses || 0,
        expiresAt: coupon.expiresAt || '',
        oncePerUser: coupon.oncePerUser || false,
        enabled: coupon.enabled
      });
    } else {
      setEditingId(null);
      setFormData({ code: '', discountPercentage: 10, maxUses: 0, expiresAt: '', oncePerUser: false, enabled: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const toastId = toast.loading('Saving coupon...');
    try {
      const data = { 
        ...formData, 
        discountPercentage: Number(formData.discountPercentage),
        maxUses: Number(formData.maxUses),
        usedCount: editingId ? undefined : 0,
        usedBy: editingId ? undefined : []
      };
      
      // Clean up undefined fields
      if (editingId) {
        delete (data as any).usedCount;
        delete (data as any).usedBy;
      }

      if (editingId) {
        await updateDoc(doc(db, 'coupons', editingId), data);
        toast.success('Coupon updated', { id: toastId });
      } else {
        await addDoc(collection(db, 'coupons'), data);
        toast.success('Coupon created', { id: toastId });
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message, { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Coupons</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Coupon
        </button>
      </div>

      <div className="bg-white retro-border rounded-xl border border-black overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="p-4 text-xs font-bold text-gray-600 uppercase">Code</th>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase">Discount (%)</th>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase">Usage</th>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-sm font-bold text-black uppercase tracking-wider">
                  {coupon.code}
                  {coupon.expiresAt && <div className="text-xs text-gray-500 normal-case mt-1">Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</div>}
                  {coupon.oncePerUser && <div className="text-xs text-blue-500 normal-case mt-1">Once per user</div>}
                </td>
                <td className="p-4 text-sm text-gray-800">{coupon.discountPercentage}%</td>
                <td className="p-4 text-sm text-gray-800">
                  {coupon.usedCount || 0} {coupon.maxUses > 0 ? `/ ${coupon.maxUses}` : '(Unlimited)'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${coupon.enabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-700'}`}>
                    {coupon.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenModal(coupon)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded mr-2"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-700">No coupons found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white retro-border border border-black rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-black"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Coupon Code</label>
                <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black uppercase tracking-wider" placeholder="e.g. SUMMER20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Discount Percentage (%)</label>
                <input type="number" required min="1" max="100" value={formData.discountPercentage} onChange={e => setFormData({...formData, discountPercentage: Number(e.target.value)})} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Max Uses (0 for unlimited)</label>
                <input type="number" min="0" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: Number(e.target.value)})} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date (Optional)</label>
                <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black" />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.oncePerUser} onChange={e => setFormData({...formData, oncePerUser: e.target.checked})} className="rounded border-gray-700 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Limit to one use per player</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select value={formData.enabled ? 'true' : 'false'} onChange={e => setFormData({...formData, enabled: e.target.value === 'true'})} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-black">
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-black mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:text-black transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-black font-bold px-6 py-2 rounded-lg transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
