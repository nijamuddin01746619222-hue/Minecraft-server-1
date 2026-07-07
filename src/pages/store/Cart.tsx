import { useCartStore } from '../../store/useCartStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatPrice } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal, getTotal } = useCartStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white retro-border border-black rounded-2xl p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-black mb-2 uppercase tracking-widest font-pixel">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 max-w-md text-sm">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="retro-btn px-8 py-3 text-sm inline-flex items-center gap-2">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-12 pt-8">
      <h1 className="text-3xl font-pixel text-black mb-8 tracking-widest uppercase">YOUR CART <span className="text-gray-500 text-lg font-bold ml-2">({items.length} items)</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 font-pixel">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {items.map((item) => {
            let itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
            let finalItemPrice = itemPrice;
            
            if (item.appliedCoupon) {
              finalItemPrice -= itemPrice * (item.appliedCoupon.discountPercentage / 100);
              finalItemPrice = Math.max(0, finalItemPrice);
            }
            
            return (
              <div key={item.id} className="bg-white retro-border border-black rounded-xl p-4 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 sm:gap-4 relative group hover:border-gray-600 transition-colors">
                <div className="col-span-6 flex items-center gap-4 w-full">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain border border-black rounded-lg p-2 bg-gray-50" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-50 border border-black rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500 uppercase">IMG</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-black text-lg">{item.name}</h3>
                    {item.category && <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{item.category}</p>}
                    {item.appliedCoupon && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase mt-1 inline-block border border-green-200">
                        Coupon: {item.appliedCoupon.code}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 text-center w-full flex sm:block justify-between items-center sm:mt-0">
                  <span className="sm:hidden text-xs text-gray-500 uppercase font-bold">Price:</span>
                  <div className="flex flex-col">
                    <span className="text-black font-bold">{formatPrice(finalItemPrice, settings.currency)}</span>
                    {(item.discount || 0) > 0 && <span className="text-xs text-gray-500 line-through">{formatPrice(item.price, settings.currency)}</span>}
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center justify-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 text-black bg-gray-100 border border-black rounded hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-black">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-black bg-gray-100 border border-black rounded hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="col-span-2 flex items-center justify-between sm:justify-end gap-4 w-full">
                  <span className="sm:hidden text-xs text-gray-500 uppercase font-bold">Total:</span>
                  <span className="font-black text-primary text-lg">{formatPrice(finalItemPrice * item.quantity, settings.currency)}</span>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors absolute top-2 right-2 sm:static opacity-50 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white retro-border border-black rounded-xl p-6 sticky top-24">
            <h2 className="font-pixel text-xl text-black mb-6 border-b-2 border-black pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-bold">
                <span>Subtotal</span>
                <span className="text-black">{formatPrice(getSubtotal(), settings.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t-2 border-black">
                <span className="text-black font-pixel text-sm">Total</span>
                <span className="text-primary text-2xl">{formatPrice(getTotal(), settings.currency)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full retro-btn py-4 flex items-center justify-center gap-2"
            >
              PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/" className="w-full text-center text-xs font-bold text-gray-500 hover:text-black uppercase mt-4 block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
