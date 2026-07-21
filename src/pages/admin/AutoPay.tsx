import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { db } from '../../lib/firebase';
import { doc, updateDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CreditCard, Power, List, Search } from 'lucide-react';

export default function AutoPay() {
  const { settings } = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const autoPayEnabled = settings.autoPayment?.enabled || false;

  useEffect(() => {
    // Listen to used transactions from Firestore
    const q = query(collection(db, 'usedTransactions'), orderBy('usedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'settings', 'global'), {
        'autoPayment.enabled': !autoPayEnabled
      });
      toast.success(autoPayEnabled ? 'Auto Pay disabled' : 'Auto Pay enabled');
    } catch (error) {
      console.error('Error toggling auto pay:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => 
    t.txid?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-pixel text-black flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            Auto Pay Configuration
          </h1>
          <p className="text-gray-600 mt-2">Manage automatic payment verification via SMS Sync</p>
        </div>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-6 mb-6">
          <div>
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Power className={`w-5 h-5 ${autoPayEnabled ? 'text-green-500' : 'text-red-500'}`} />
              Auto Payment Status
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              When enabled, users can instantly verify their payments using Transaction IDs.
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              autoPayEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                autoPayEnabled ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-2">How it works:</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>Your mobile app listens for SMS from bKash, Nagad, and Rocket.</li>
            <li>The app pushes transaction details to Realtime Database (<code className="bg-blue-100 px-1 rounded">XNXANIKPAY</code> node).</li>
            <li>Users enter their Transaction ID during checkout.</li>
            <li>The system verifies the ID, checks the amount, and instantly processes the order if matched.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-pixel text-black flex items-center gap-2">
            <List className="w-6 h-6 text-primary" />
            Used Transaction IDs
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search TrxID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                <th className="p-4 font-bold text-black uppercase text-xs tracking-wider">Transaction ID</th>
                <th className="p-4 font-bold text-black uppercase text-xs tracking-wider">Method</th>
                <th className="p-4 font-bold text-black uppercase text-xs tracking-wider">Amount</th>
                <th className="p-4 font-bold text-black uppercase text-xs tracking-wider">User</th>
                <th className="p-4 font-bold text-black uppercase text-xs tracking-wider">Date Used</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-bold border-b border-gray-200">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-black">{t.txid}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        t.method === 'B' || t.method?.toLowerCase() === 'bkash' ? 'bg-[#e2136e]' :
                        t.method === 'N' || t.method?.toLowerCase() === 'nagad' ? 'bg-[#e81f18]' :
                        t.method === 'R' || t.method?.toLowerCase() === 'rocket' ? 'bg-[#8A1538]' :
                        'bg-gray-600'
                      }`}>
                        {t.method === 'B' ? 'bKash' : t.method === 'N' ? 'Nagad' : t.method === 'R' ? 'Rocket' : t.method}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-green-600">{settings.currency}{t.amount}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{t.username}</div>
                      <div className="text-xs text-gray-500">{t.email}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600">
                      {t.usedAt?.toDate ? t.usedAt.toDate().toLocaleString() : new Date(t.usedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
