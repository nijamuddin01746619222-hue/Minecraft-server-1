import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { formatPrice } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, arrayUnion, increment } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Check, ShieldCheck, Info, Upload, Tag } from 'lucide-react';

export default function Checkout() {
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const { settings } = useSettingsStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [minecraftUsername, setMinecraftUsername] = useState(user?.minecraftUsername || '');
  const [email, setEmail] = useState(user?.email || '');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to checkout');
      navigate('/auth');
      return;
    }
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate, user]);

  const activeMethods = Object.entries(settings.paymentMethods).filter(([_, method]) => method.enabled);
  const selectedMethodData = activeMethods.find(([key]) => key === paymentMethod)?.[1];

  const getFinalTotal = () => {
    let sub = getTotal(); 
    if (appliedCoupon) {
      sub = sub - (sub * (appliedCoupon.discountPercentage / 100));
    }
    return Math.max(0, sub);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const toastId = toast.loading('Verifying coupon...');
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase().trim()), where('enabled', '==', true));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        toast.error('Invalid or expired coupon', { id: toastId });
        return;
      }
      
      const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;

      if (coupon.maxUses > 0 && (coupon.usedCount || 0) >= coupon.maxUses) {
        toast.error('Coupon usage limit reached', { id: toastId });
        return;
      }
      
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        toast.error('Coupon has expired', { id: toastId });
        return;
      }
      
      if (coupon.oncePerUser) {
        const identifier = minecraftUsername.toLowerCase().trim() || email.toLowerCase().trim();
        if (!identifier) {
          toast.error('Please enter your Minecraft Username or Email first', { id: toastId });
          return;
        }
        if (coupon.usedBy && coupon.usedBy.includes(identifier)) {
          toast.error('You have already used this coupon', { id: toastId });
          return;
        }
      }

      setAppliedCoupon(coupon);
      toast.success(`Coupon applied! ${coupon.discountPercentage}% off`, { id: toastId });
    } catch (error) {
      toast.error('Failed to apply coupon', { id: toastId });
    }
  };

  const handleProceedToPayment = (e: any) => {
    e.preventDefault();
    if (!minecraftUsername.trim()) {
      toast.error('Minecraft username is required');
      return;
    }
    setStep(2);
  };

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('Processing order...');
    
    try {
      const orderData = {
        userId: user?.id || null,
        minecraftUsername,
        email,
        items,
        total: getFinalTotal(),
        subtotal: getTotal(),
        couponInfo: appliedCoupon ? {
          code: appliedCoupon.code,
          discountPercentage: appliedCoupon.discountPercentage
        } : null,
        paymentMethod,
        transactionId,
        senderNumber,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'orders'), orderData);
      
      // Update coupon usage
      if (appliedCoupon) {
        const identifier = minecraftUsername.toLowerCase().trim() || email.toLowerCase().trim();
        await updateDoc(doc(db, 'coupons', appliedCoupon.id), {
          usedCount: increment(1),
          usedBy: arrayUnion(identifier)
        });
      }
      
      clearCart();
      toast.success('Order placed successfully! Pending review.', { id: toastId });
      navigate('/profile');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 pt-8">
      <h1 className="text-3xl font-pixel text-black mb-8 tracking-widest uppercase">
        {step === 1 ? 'CHECKOUT DETAILS' : 'PAYMENT GATEWAY'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div className="bg-white retro-border border-black rounded-xl p-6">
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
                    <p className="text-xs text-gray-500 mt-2">Enter your exact Minecraft username. Purchases are non-transferable.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-bold"
                      placeholder="steve@example.com"
                    />
                  </div>
                </div>

                <div className="border-t-2 border-black pt-6">
                  <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Have a Coupon Code?
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                      className="flex-1 bg-white border-2 border-black rounded-lg px-4 py-3 text-black font-bold uppercase tracking-wider disabled:opacity-50"
                      placeholder="Enter code here"
                    />
                    {!appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                      >
                        APPLY
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                      >
                        REMOVE
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="mt-3 text-sm font-bold text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      Code {appliedCoupon.code} applied! You get {appliedCoupon.discountPercentage}% off.
                    </div>
                  )}
                </div>

                {!user && (
                  <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800 font-bold">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <p>You are checking out as a guest. <Link to="/auth" className="underline hover:text-black">Login</Link> to save your purchase history.</p>
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                className="w-full retro-btn py-4 text-lg"
              >
                PROCEED TO PAYMENT
              </button>
            </form>
          )}

          {step === 2 && (
            <form id="payment-form" onSubmit={handleCheckout} className="space-y-6">
              <div className="bg-white retro-border border-black rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold font-pixel text-black flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-sm">2</span>
                    Payment Method
                  </h2>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-sm font-bold text-gray-500 hover:text-black underline"
                  >
                    Back to Details
                  </button>
                </div>
                
                {activeMethods.length === 0 ? (
                  <div className="text-center py-6 text-gray-600 border border-dashed border-black rounded-lg font-bold">
                    No payment methods available. Please contact support.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeMethods.map(([key, method]) => (
                      <label 
                        key={key} 
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === key 
                            ? 'bg-primary/10 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                            : 'bg-white border-black hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={key}
                          checked={paymentMethod === key}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="hidden"
                        />
                        <div className="flex-1 capitalize font-bold text-black text-lg">{key}</div>
                        {paymentMethod === key && <Check className="w-6 h-6 text-black" strokeWidth={3} />}
                      </label>
                    ))}
                  </div>
                )}

                {paymentMethod && selectedMethodData && (
                  <div className="mt-6 p-6 bg-gray-50 border-2 border-black rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold text-black mb-4 capitalize font-pixel text-sm">Pay via {paymentMethod}</h3>
                    
                    <div className="bg-white border-2 border-black p-4 rounded-lg mb-6 shadow-sm">
                      {(selectedMethodData as any).number && (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                          <span className="text-gray-600 text-sm font-bold">Send Money To:</span>
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md border border-gray-300">
                            <span className="font-bold text-black text-xl tracking-wider">{(selectedMethodData as any).number}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText((selectedMethodData as any).number);
                                toast.success('Number copied to clipboard!');
                              }}
                              className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold transition-colors ml-2"
                            >
                              COPY
                            </button>
                          </div>
                        </div>
                      )}
                      {(selectedMethodData as any).type && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 text-sm font-bold">Account Type:</span>
                          <span className="text-black font-bold uppercase bg-gray-200 px-2 py-1 rounded text-xs">{(selectedMethodData as any).type}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-gray-300 mt-4">
                        <span className="text-gray-600 text-sm font-bold">Amount to send:</span>
                        <span className="font-black text-primary text-2xl">{formatPrice(getFinalTotal(), settings.currency)}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Transaction ID / TrxID <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-black font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-colors uppercase"
                          placeholder="e.g. 7X8Y9Z0A"
                        />
                      </div>
                      
                      {(selectedMethodData as any).number && (
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Sender Number <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-black font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            placeholder="01XXXXXXXXX"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white retro-border border-black rounded-xl p-6 sticky top-24">
            <h2 className="font-pixel text-xl text-black mb-6 border-b-2 border-black pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => {
                let itemPrice = (item.discount || 0) > 0 ? item.price * (1 - item.discount! / 100) : item.price;
                let finalItemPrice = itemPrice;
                if (item.appliedCoupon) {
                  if (item.appliedCoupon.type === 'percentage') {
                    finalItemPrice -= itemPrice * (item.appliedCoupon.value / 100);
                  } else {
                    finalItemPrice -= item.appliedCoupon.value;
                  }
                  finalItemPrice = Math.max(0, finalItemPrice);
                }
                
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="text-gray-800 flex-1 pr-4 font-bold">
                      <span className="text-gray-500">{item.quantity}x</span> {item.name}
                    </div>
                    <div className="text-black font-bold text-right">
                      {formatPrice(finalItemPrice * item.quantity, settings.currency)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t-2 border-black pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm font-bold">
                <span>Subtotal</span>
                <span>{formatPrice(getTotal(), settings.currency)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 text-sm font-bold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-{appliedCoupon.discountPercentage}%</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t-2 border-black">
                <span className="text-black font-pixel text-sm">Total</span>
                <span className="text-primary text-2xl">{formatPrice(getFinalTotal(), settings.currency)}</span>
              </div>
            </div>

            {step === 2 && (
              <>
                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1"
                    form="payment-form"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed font-bold">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                  </span>
                </label>

                <button 
                  type="submit"
                  form="payment-form"
                  disabled={loading || !paymentMethod}
                  className="w-full retro-btn py-4 disabled:opacity-50"
                >
                  {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
