import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ShoppingCart, Users, DollarSign, Package } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { settings } = useSettingsStore();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const usersSnap = await getDocs(collection(db, 'users'));
        
        let sales = 0;
        let pending = 0;
        const allOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        allOrders.forEach((order: any) => {
          if (order.status === 'approved') sales += order.total;
          if (order.status === 'pending') pending++;
        });

        allOrders.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

        setStats({
          totalSales: sales,
          totalOrders: allOrders.length,
          totalUsers: usersSnap.size,
          pendingOrders: pending
        });
        
        setRecentOrders(allOrders.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-black mb-8 tracking-widest uppercase">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white retro-border rounded-xl animate-pulse"></div>)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white retro-border p-6 rounded-xl border border-black flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-widest">TOTAL SALES</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-black">{formatPrice(stats.totalSales || 0, settings.currency)}</div>
              </div>
            </div>
            
            <div className="bg-white retro-border p-6 rounded-xl border border-black flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-widest">TOTAL ORDERS</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-black">{stats.totalOrders || 0}</div>
              </div>
            </div>

            <div className="bg-white retro-border p-6 rounded-xl border border-black flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-widest">TOTAL USERS</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-black">{stats.totalUsers || 0}</div>
              </div>
            </div>

            <div className="bg-white retro-border p-6 rounded-xl border border-black flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <h3 className="text-gray-600 font-bold text-xs uppercase tracking-widest">PENDING ORDERS</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-black">{stats.pendingOrders || 0}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white retro-border rounded-xl border border-black p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">SALES OVERVIEW</h2>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-primary"><div className="w-2 h-2 rounded-full bg-primary"></div> This Month</div>
                  <div className="flex items-center gap-1.5 text-gray-700"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Last Month</div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[]}>
                    <XAxis dataKey="name" stroke="#374151" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#374151" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `৳${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1f2937', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="thisMonth" stroke="#00e5ff" strokeWidth={3} dot={{r:4, fill:'#00e5ff', strokeWidth:0}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="lastMonth" stroke="#374151" strokeWidth={2} dot={false} activeDot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white retro-border rounded-xl border border-black p-6">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-6">TOP PRODUCTS</h2>
              <div className="space-y-5">
                <div className="text-gray-700 text-xs font-bold uppercase tracking-widest text-center py-8">No data available</div>
              </div>
            </div>
          </div>

          <div className="bg-white retro-border rounded-xl border border-black overflow-hidden">
            <div className="p-6 border-b border-black">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">LATEST ORDERS</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/30">
                    <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Order ID</th>
                    <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-widest">User</th>
                    <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Product</th>
                    <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 text-xs text-gray-600 font-mono">#{order.id.slice(0,8).toUpperCase()}</td>
                      <td className="p-4 text-xs text-black font-bold">{order.minecraftUsername}</td>
                      <td className="p-4 text-xs text-gray-600">{order.items?.[0]?.name || 'Multiple Items'}</td>
                      <td className="p-4 text-xs text-black font-bold tracking-wider">{formatPrice(order.total, settings.currency)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'approved' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' :
                          order.status === 'rejected' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-700">
                        {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleDateString() : '1 min ago'}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-700 text-xs font-bold uppercase tracking-widest">No recent orders</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
