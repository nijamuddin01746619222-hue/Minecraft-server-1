import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatPrice } from '../../lib/utils';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, getTotal, getSubtotal } = useCartStore();
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

  const [minecraftUsername, setMinecraftUsername] = useState(user?.minecraftUsername || '');
  const [email, setEmail] = useState(user?.email || '');
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  const handleProceedToPayment = (e: any) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions');
      return;
    }

    if (!minecraftUsername.trim() || !email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Proceed to PaymentGateway page with the details
    navigate('/payment', { 
      state: { 
        minecraftUsername, 
        email 
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 pt-8">
      <h1 className="text-3xl font-pixel text-black mb-8 tracking-widest uppercase">
        CHECKOUT DETAILS
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form id="checkout-form" onSubmit={handleProceedToPayment} className="space-y-6">
            <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-bold font-pixel text-black mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-sm">1</span>
                Player Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Minecraft Username <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={minecraftUsername}
                    onChange={(e) => setMinecraftUsername(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                    placeholder="Notch"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">Enter your exact Minecraft username.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                    placeholder="steve@minecraft.net"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">For payment receipts and support.</p>
                </div>
              </div>

              {!user && (
                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800 font-bold">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <p>You are checking out as a guest. <Link to="/auth" className="underline hover:text-black">Login</Link> to save your purchase history.</p>
                </div>
              )}
            </div>
            
            <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-800 font-bold">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                </span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white border-2 border-black rounded-xl py-4 text-lg font-bold font-pixel shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
            >
              PROCEED TO PAYMENT
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 sticky top-24">
            <h2 className="font-pixel text-xl text-black mb-6 border-b-2 border-black pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => {
                let itemPrice = (item.discount || 0) > 0 ? item.price * (1 - item.discount! / 100) : item.price;
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="text-gray-800 flex-1 pr-4 font-bold">
                      <span className="text-gray-500">{item.quantity}x</span> {item.name}
                    </div>
                    <div className="text-black font-bold text-right">
                      {formatPrice(itemPrice * item.quantity, settings.currency)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t-2 border-black pt-4 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm font-bold">
                <span>Subtotal</span>
                <span>{formatPrice(getSubtotal(), settings.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t-2 border-black">
                <span className="text-black font-pixel text-sm">Total</span>
                <span className="text-primary text-2xl">{formatPrice(getTotal(), settings.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
