const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetStr = `import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';`;

const replaceStr = `import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Award, Zap, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';`;

file = file.replace(targetStr, replaceStr);

const stateTarget = `  const { settings } = useSettingsStore();
  const [players, setPlayers] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);`;

const stateReplace = `  const { settings } = useSettingsStore();
  const { user, isAdminLoggedIn } = useAuthStore();
  const [players, setPlayers] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();`;

file = file.replace(stateTarget, stateReplace);

const fetchTarget = `    };

    fetchRecentOrders();
  }, []);`;

const fetchReplace = `    };

    const fetchProductCounts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const counts: Record<string, number> = {};
        snap.forEach(doc => {
          const data = doc.data();
          if (data.enabled !== false) {
             counts[data.category] = (counts[data.category] || 0) + 1;
          }
        });
        setProductCounts(counts);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRecentOrders();
    fetchProductCounts();
  }, []);`;
  
file = file.replace(fetchTarget, fetchReplace);

// Now change the button rendering in `categories.map`
const catTarget = `          return (
            <Link 
              key={cat.id}
              to={cat.link} 
              className="group relative bg-white retro-border border-black rounded-xl p-6 overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_8px_0_0_#000] transition-all duration-300"
            >
              <div className="mb-4">
                <h2 className="text-xl font-pixel text-black mb-2">{cat.name}</h2>
                <p className="text-gray-600 font-bold text-xs leading-snug">
                  {defaultDesc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-4 mt-auto">
                <div className="w-20 h-20 flex items-center justify-center">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Zap className="w-12 h-12 text-primary opacity-50 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <button className="w-full retro-btn py-2 text-sm">
                  View {cat.name}
                </button>
              </div>
            </Link>
          );`;
          
const catReplace = `          return (
            <div key={cat.id} className="relative group">
              <Link 
                to={cat.link} 
                className="block h-full bg-white retro-border border-black rounded-xl p-6 overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_8px_0_0_#000] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-pixel text-black mb-2">{cat.name}</h2>
                  <p className="text-gray-600 font-bold text-xs leading-snug">
                    {defaultDesc}
                  </p>
                  <div className="mt-2 text-xs font-bold text-primary">
                    {productCounts[cat.id] || 0} Products
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4 mt-auto">
                  <div className="w-20 h-20 flex items-center justify-center">
                    {cat.icon ? (
                      <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <Zap className="w-12 h-12 text-primary opacity-50 group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <button className="w-full retro-btn py-2 text-sm">
                    View {cat.name}
                  </button>
                </div>
              </Link>
              
              {(isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin') && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(\`/admin/products?category=\${cat.id}&add=true\`);
                  }}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-2 border-white"
                  title="Add product to this category"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          );`;

file = file.replace(catTarget, catReplace);

fs.writeFileSync('src/pages/store/Home.tsx', file);
