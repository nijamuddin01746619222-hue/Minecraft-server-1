const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Profile.tsx', 'utf8');

const targetStr = `      <h2 className="text-2xl font-bold text-black mb-6">Order History</h2>
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
                  <div className={\`px-3 py-1 rounded-full border text-xs font-bold uppercase flex items-center gap-1.5 \${getStatusColor(order.status)}\`}>
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
}`;

const replaceStr = `
      <div className="bg-[#1a1b23] border border-black rounded-xl overflow-hidden p-6 text-white">
        <h2 className="text-2xl font-bold font-pixel mb-6">My History</h2>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-24 bg-gray-800 rounded-xl animate-pulse"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="pb-3 px-4 font-normal">Product</th>
                  <th className="pb-3 px-4 font-normal">Price</th>
                  <th className="pb-3 px-4 font-normal">Purchased At</th>
                  <th className="pb-3 px-4 font-normal">Expire In</th>
                  <th className="pb-3 px-4 font-normal">Link</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.flatMap(order => 
                  order.items.map((item: any, idx: number) => {
                    const isApproved = order.status === 'approved';
                    const createdAt = order.createdAt ? new Date(order.createdAt.toMillis()) : new Date();
                    
                    let expiryText = '-';
                    let isExpired = false;
                    
                    if (item.linkExpiry && item.linkExpiry !== 'Lifetime') {
                      let expiryTime = createdAt.getTime();
                      if (item.linkExpiry === '24 Hours') expiryTime += 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '48 Hours') expiryTime += 48 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '3 Days') expiryTime += 3 * 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '7 Days') expiryTime += 7 * 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '14 Days') expiryTime += 14 * 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '30 Days') expiryTime += 30 * 24 * 60 * 60 * 1000;
                      
                      const now = new Date().getTime();
                      if (now > expiryTime) {
                        expiryText = 'Expired';
                        isExpired = true;
                      } else {
                        const diff = expiryTime - now;
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        expiryText = days > 0 ? \`\${days} Days\` : \`\${hours} Hours\`;
                      }
                    } else if (item.linkExpiry === 'Lifetime') {
                      expiryText = 'Lifetime';
                    }

                    return (
                      <tr key={\`\${order.id}-\${idx}\`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-4 font-bold">{item.name} {order.status === 'pending' && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Pending</span>} {order.status === 'rejected' && <span className="ml-2 text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">Rejected</span>}</td>
                        <td className="py-4 px-4">{formatPrice(item.salePrice || item.price, settings.currency)}</td>
                        <td className="py-4 px-4">{createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="py-4 px-4">{expiryText}</td>
                        <td className="py-4 px-4">
                          {isApproved && item.productLink && !isExpired ? (
                            <a href={item.productLink} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-bold">View Link</a>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-xs text-gray-500">
          Note: Links will be expired automatically after the time limit.
        </div>
      </div>
    </div>
  );
}`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/store/Profile.tsx', file);
