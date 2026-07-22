import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CheckCircle, Package } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function PaymentComplete() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettingsStore();

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Failed to fetch completed payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderComplete = async (orderId: string) => {
    const toastId = toast.loading('Marking as completed...');
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'completed' });
      toast.success('Order fulfilled and completed!', { id: toastId });
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error: any) {
      toast.error('Failed to complete: ' + error.message, { id: toastId });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
        <CheckCircle className="w-8 h-8 text-primary" />
        Payment Complete / Fulfillment
      </h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        These orders have been paid for (Auto Payment successful or manually approved) and are waiting for you to fulfill them in-game. Click "Order Complete" when done.
      </p>

      {orders.length === 0 ? (
        <div className="bg-white retro-border rounded-xl border border-black p-12 text-center flex flex-col items-center">
          <Package className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-600">No pending fulfillments</h2>
          <p className="text-sm text-gray-500 mt-2">All paid orders have been completed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white retro-border rounded-xl border border-black p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Order ID</span>
                    <span className="font-mono text-sm text-black">{order.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Amount</span>
                    <span className="font-bold text-green-600 text-lg">{formatPrice(order.total, settings.currency)}</span>
                  </div>
                </div>

                <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 mb-4 text-center">
                  <span className="text-xs text-gray-600 font-bold uppercase tracking-widest block mb-2">Player Name / Game ID</span>
                  <span className="text-3xl font-black tracking-widest text-black block break-all">
                    {order.minecraftUsername || order.email?.split('@')[0] || 'Unknown'}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Email:</span>
                    <span className="text-black font-medium text-right max-w-[150px] truncate" title={order.email}>{order.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">TxID:</span>
                    <span className="text-black font-mono">{order.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Method:</span>
                    <span className="text-black capitalize">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-2">Items Ordered</span>
                  <ul className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {order.items?.map((item: any, i: number) => (
                      <li key={i} className="text-sm font-bold text-gray-800 flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => handleOrderComplete(order.id)}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-bold retro-btn rounded-lg text-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Order Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
