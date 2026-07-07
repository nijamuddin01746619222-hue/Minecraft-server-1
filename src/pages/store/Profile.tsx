import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function Profile() {
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.id),
          // Note: Requires composite index if we order by createdAt. 
          // For now, we will sort in memory to avoid index requirement issues dynamically.
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetched.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setOrders(fetched);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded': return <RefreshCw className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'refunded': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white retro-border border border-black rounded-xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-primary/20 rounded-xl flex items-center justify-center">
            {/* Minecraft face fallback or just initial */}
            <span className="text-4xl font-bold text-primary">
              {(user.minecraftUsername || user.email || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{user.minecraftUsername || 'Player'}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-2 px-2 py-1 bg-primary text-black font-bold text-xs uppercase rounded retro-border border-black">
                Admin
              </span>
            )}
            <div className="mt-4 flex gap-4">
              <div className="bg-background px-4 py-2 rounded-lg border border-black">
                <span className="text-xs text-gray-700 uppercase tracking-wider block mb-1">Total Spent</span>
                <span className="font-bold text-black">{formatPrice(user.totalSpent || 0, settings.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-black mb-6">Order History</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white retro-border rounded-xl border border-black animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white retro-border border border-black rounded-xl">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black mb-2">No orders found</h3>
          <p className="text-gray-600">You haven't made any purchases yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white retro-border border border-black rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-gray-700 font-mono mb-1 block">Order #{order.id}</span>
                    <span className="text-sm text-gray-600 block">
                      {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status === 'approved' ? 'Confirmed' : order.status}
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-lg mb-4 font-bold">
                    Your order will be confirmed within 24 hours. Usually it takes 1 hour but due to some issues it can take up to 24 hours.
                  </div>
                )}
                
                <div className="space-y-2">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-800">{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:border-l md:border-black md:pl-6 flex md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-black md:border-t-0">
                <div className="text-sm text-gray-600 mb-1 capitalize">Via {order.paymentMethod}</div>
                <div className="text-2xl font-bold text-black">{formatPrice(order.total, settings.currency)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
