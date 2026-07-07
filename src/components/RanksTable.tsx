import { Check } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { formatPrice, cn } from '../lib/utils';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function RanksTable({ products }: { products: any[] }) {
  const { settings } = useSettingsStore();
  const addItem = useCartStore(state => state.addItem);

  const features = (settings.rankFeatures || []).filter(f => f.visible).sort((a, b) => a.order - b.order);
  
  if (products.length === 0) {
    return <div className="text-center py-24 text-gray-700 border border-dashed border-black rounded-xl tracking-widest uppercase text-sm font-bold">No ranks found.</div>;
  }

  return (
    <div className="retro-card overflow-hidden overflow-x-auto">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="p-4 border-b-2 border-r-2 border-black bg-gray-100/50 w-1/4">
              <div className="text-left font-pixel text-xl p-2">Features</div>
            </th>
            {products.map(product => (
              <th key={product.id} className="p-4 border-b-2 border-r-2 last:border-r-0 border-black min-w-[200px] align-top bg-white">
                <div className="flex flex-col items-center gap-2">
                  {product.image && <img src={product.image} alt={product.name} className="h-20 object-contain drop-shadow-md" />}
                  <h3 className="font-pixel text-sm mt-2">{product.name}</h3>
                  
                  <div className="flex flex-col gap-1 my-2">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-xs text-gray-500 line-through">{formatPrice(product.price, settings.currency)}</span>
                        <span className="text-sm font-bold text-red-500">{formatPrice(product.price * (1 - product.discount / 100), settings.currency)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold">{formatPrice(product.price, settings.currency)}</span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/product/${product.id}`}
                    className="retro-btn text-[10px] py-2 px-4 w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr key={feature.id} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
              <td className="p-4 border-b border-r-2 border-black text-left font-semibold text-sm">
                {feature.name}
              </td>
              {products.map(product => {
                const rankData = product.rankData || {};
                const value = rankData[feature.id];
                
                return (
                  <td key={product.id} className="p-4 border-b border-r-2 last:border-r-0 border-black text-sm">
                    {feature.type === 'boolean' ? (
                      value ? <Check className="w-5 h-5 mx-auto text-green-500" strokeWidth={3} /> : <span className="text-gray-400">×</span>
                    ) : (
                      <span className={cn(
                        "font-medium", 
                        !value && "text-gray-400"
                      )}>{value || '—'}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
