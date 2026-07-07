import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatPrice } from '../../lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function CategoryPage({ type }: { type?: string }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const id = type || categoryId;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettingsStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), where('category', '==', id));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => p.enabled === true));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [id]);

  const categoryTitles: Record<string, string> = {
    ranks: 'Server Ranks',
    coins: 'Pebbles & Coins'
  };

  if (loading) {
    return <div className="py-20 text-center font-bold text-gray-500">LOADING...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-12 pt-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-black mb-4 uppercase tracking-widest font-pixel">
          {categoryTitles[id || ''] || 'Products'}
        </h1>
        <p className="text-gray-600 font-bold max-w-2xl mx-auto">
          {id === 'ranks' 
            ? 'Unlock exclusive perks, commands & cosmetics. Build your legacy on FIEXFALL.' 
            : 'Upgrade your gameplay and dominate the server.'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white retro-border border-black rounded-xl">
          <p className="font-bold text-gray-500 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white retro-border border-black rounded-xl overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-300">
              <div className="p-6 bg-gray-50 border-b-2 border-black text-center relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                {product.image && (
                  <img src={product.image} alt={product.name} className="h-32 object-contain mx-auto group-hover:scale-110 transition-transform duration-300" />
                )}
                <h2 className="text-2xl font-bold font-pixel text-black mt-4">{product.name}</h2>
                <div className="mt-2 flex items-center justify-center gap-2">
                  {product.salePrice > 0 ? (
                    <>
                      <span className="text-sm text-gray-400 line-through font-bold">{formatPrice(product.price, settings.currency)}</span>
                      <span className="text-xl text-primary font-black">{formatPrice(product.salePrice, settings.currency)}</span>
                    </>
                  ) : (
                    <span className="text-xl text-black font-black">{formatPrice(product.price, settings.currency)}</span>
                  )}
                </div>
                {user ? (
                  <button 
                    onClick={() => {
                      addItem({ ...product, quantity: 1 });
                      navigate('/checkout');
                    }}
                    className="mt-4 w-full retro-btn py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/auth')}
                    className="mt-4 w-full retro-btn py-3 text-sm flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    LOGIN TO PURCHASE
                  </button>
                )}
              </div>

              {id === 'ranks' && product.rankData ? (
                <div className="p-6 bg-white flex-1 space-y-4">
                  <h3 className="font-pixel text-sm border-b-2 border-black pb-2 mb-4">Details</h3>
                  
                  {Object.entries({
                    'Name Prefix': product.rankData.namePrefixImage ? <img src={product.rankData.namePrefixImage} alt="Prefix" className="h-5 object-contain inline-block" /> : null,
                    'Exclusive Tag': product.rankData.exclusiveTag,
                    'Set Home': product.rankData.setHome,
                    'Daily Flight': product.rankData.dailyFlight,
                    'Auction House Slot': product.rankData.auctionHouseSlot,
                    'Claim Blocks': product.rankData.claimBlocks,
                    'Crate Keys': product.rankData.crateKeys,
                    'Player Vault': product.rankData.playerVault,
                    'Job Booster': product.rankData.jobBooster,
                    'Player Warp': product.rankData.playerWarp,
                    'Discord Role': product.rankData.discordRole === 'Yes' ? 'Yes' : 'No',
                    'Access To': product.rankData.accessTo
                  }).map(([key, val]) => (
                    (val || val === 0) ? (
                      <div key={key} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="font-bold text-gray-500">{key}</span>
                        <span className="font-bold text-black text-right max-w-[60%]">{val}</span>
                      </div>
                    ) : null
                  ))}
                  
                  {product.description && (
                    <div className="mt-4 pt-4 border-t-2 border-black text-sm text-gray-600 font-bold leading-relaxed">
                      {product.description}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-white flex-1">
                  <p className="text-gray-600 font-bold text-sm mb-4">{product.description}</p>
                  
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-2 mt-4 border-t-2 border-black pt-4">
                      {product.features.map((f: string, i: number) => (
                        <li key={i} className="text-sm font-bold text-gray-700 flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
