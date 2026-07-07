import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/utils';
import { Zap, Tag, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const addItem = useCartStore(state => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        toast.error('Invalid coupon code');
        setAppliedCoupon(null);
        return;
      }

      const coupon = snap.docs[0].data();
      if (!coupon.enabled) {
        toast.error('This coupon is currently disabled');
        return;
      }
      
      setAppliedCoupon(coupon);
      toast.success('Coupon applied!');
    } catch (error) {
      toast.error('Failed to verify coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse font-pixel">LOADING...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center font-pixel">PRODUCT NOT FOUND</div>;
  }

  const basePrice = product.price;
  const storeDiscount = product.salePrice && product.salePrice > 0 ? (basePrice - product.salePrice) : 0;
  const priceAfterStoreDiscount = product.salePrice && product.salePrice > 0 ? product.salePrice : basePrice;
  
  let finalPrice = priceAfterStoreDiscount;
  let couponDiscountAmount = 0;
  
  if (appliedCoupon) {
    couponDiscountAmount = finalPrice * (appliedCoupon.discountPercentage / 100);
    finalPrice = Math.max(0, finalPrice - couponDiscountAmount);
  }

  const handleBuy = () => {
    // Add to cart and redirect to checkout
    addItem({ ...product, quantity: 1, appliedCoupon });
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto w-full pt-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="retro-card p-8 flex flex-col items-center justify-center min-h-[400px]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full max-w-sm object-contain drop-shadow-2xl" />
          ) : (
            <Zap className="w-32 h-32 text-primary opacity-50" />
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-pixel text-black tracking-widest mb-2">{product.name}</h1>
            {product.subtitle && <p className="text-gray-600 font-bold text-lg">{product.subtitle}</p>}
          </div>
          
          <div className="retro-card p-6 space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Original Price</span>
              <span className="text-xl font-bold line-through text-gray-400">{formatPrice(basePrice, settings.currency)}</span>
            </div>
            
            {storeDiscount > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Discount</span>
                <span className="text-xl font-bold text-green-600">-{formatPrice(basePrice - priceAfterStoreDiscount, settings.currency)}</span>
              </div>
            )}
            
            {appliedCoupon && (
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Coupon: {appliedCoupon.code}</span>
                <span className="text-xl font-bold text-green-600">-{formatPrice(couponDiscountAmount, settings.currency)}</span>
              </div>
            )}
            
            <div className="pt-4 border-t-2 border-black">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-xs block mb-1">Final Price</span>
              <span className="text-4xl font-black text-black">{formatPrice(finalPrice, settings.currency)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Coupon Code" 
              className="flex-1 p-3 retro-border bg-white outline-none font-bold uppercase"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
            />
            <button 
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode}
              className="retro-btn px-6 py-3"
            >
              APPLY
            </button>
          </div>
          
          <button 
            onClick={handleBuy}
            className="w-full retro-btn py-4 text-lg bg-green-400 hover:bg-green-500"
          >
            BUY NOW
          </button>
          
          <div className="retro-card p-6 mt-8">
            <h3 className="font-pixel text-sm mb-4">Description</h3>
            <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
              {product.fullDescription || product.description || 'No description available.'}
            </p>
            
            {product.category === 'ranks' && product.rankData && (
              <div className="mt-6 border-t-2 border-black pt-6">
                <h3 className="font-pixel text-sm mb-4">Rank Details</h3>
                <div className="space-y-2">
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
                </div>
              </div>
            )}
            
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-pixel text-sm mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
