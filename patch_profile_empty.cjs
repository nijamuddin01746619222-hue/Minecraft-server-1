const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Profile.tsx', 'utf8');

const targetStr = `                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}`;
const replaceStr = `                {orders.flatMap(o => o.items.filter((i: any) => (i.category || 'ranks') === activeTab || (activeTab === 'pebbles' && i.category === 'coins'))).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No items found in this category.</td>
                  </tr>
                )}`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/store/Profile.tsx', file);
