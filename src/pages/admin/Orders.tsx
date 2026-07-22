import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { formatPrice } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettingsStore();

  const fetchOrders = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'orders'));
    const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    fetched.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
    setOrders(fetched);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, userId: string, total: number, status: string) => {
    const toastId = toast.loading('Updating order...');
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      
      // If approved, add to user totalSpent (simplification)
      if (status === 'approved' && userId && userId !== 'guest') {
        try {
          await updateDoc(doc(db, 'users', userId), {
            totalSpent: increment(total)
          });
        } catch (e) {
          console.error("User doc might not exist or another error", e);
        }
      }
      
      toast.success(`Order marked as ${status}`, { id: toastId });
      fetchOrders();
    } catch (error: any) {
      toast.error('Failed to update: ' + error.message, { id: toastId });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-8">Orders</h1>

      <div className="bg-white retro-border rounded-xl border border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Order ID / Date</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Payment Info</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="text-sm font-mono text-black mb-1">{order.id}</div>
                    <div className="text-xs text-gray-700">
                      {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-black mb-1">{order.minecraftUsername}</div>
                    <div className="text-xs text-gray-600">{order.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 capitalize mb-1">{order.paymentMethod}</div>
                    <div className="text-xs text-gray-700 font-mono">Trx: {order.transactionId}</div>
                    {order.senderNumber && <div className="text-xs text-gray-700 font-mono">Num: {order.senderNumber}</div>}
                    {order.voterId && <div className="text-xs text-blue-600 font-mono mt-1">Voter ID: {order.voterId}</div>}
                  </td>
                  <td className="p-4 text-sm text-black font-bold">
                    <div className="mb-1">{formatPrice(order.total, settings.currency)}</div>
                    {order.couponInfo && (
                      <div className="text-xs text-green-600 font-normal">
                        Coupon: {order.couponInfo.code} (-{order.couponInfo.discountPercentage}%)
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      order.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                      order.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                      order.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                      order.status === 'refunded' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => updateOrderStatus(order.id, order.userId, order.total, 'approved')} className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black rounded text-xs font-bold transition-colors">Approve</button>
                        <button onClick={() => updateOrderStatus(order.id, order.userId, order.total, 'rejected')} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black rounded text-xs font-bold transition-colors">Reject</button>
                      </>
                    )}
                    {order.status === 'approved' && (
                      <button onClick={() => updateOrderStatus(order.id, order.userId, order.total, 'refunded')} className="px-3 py-1 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-black rounded text-xs font-bold transition-colors">Refund</button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-700">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
