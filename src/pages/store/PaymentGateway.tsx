import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, X, Headset, Info, Copy, Check } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const { items, getTotal, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Parse checkout details from location state
  const checkoutData = location.state as {
    minecraftUsername: string;
    email: string;
  } | null;

  useEffect(() => {
    if (!checkoutData || items.length === 0) {
      navigate('/checkout');
    }
  }, [checkoutData, items, navigate]);

  if (!checkoutData || items.length === 0) return null;

  const totalAmount = getTotal();
  const gateways = settings.paymentMethods || {};
  
  // Prepare active methods with their brand colors and USSD codes
  const methodsInfo: Record<string, { name: string; color: string; ussd: string; active: boolean; number: string }> = {
    bkash: { name: 'bKash', color: '#e2136e', ussd: '*247#', active: gateways.bkash?.enabled, number: gateways.bkash?.number },
    nagad: { name: 'নগদ', color: '#e81f18', ussd: '*167#', active: gateways.nagad?.enabled, number: gateways.nagad?.number },
    rocket: { name: 'Rocket', color: '#8A1538', ussd: '*322#', active: gateways.rocket?.enabled, number: gateways.rocket?.number }
  };

  const hasActiveMethods = Object.values(methodsInfo).some(m => m.active);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Number copied to clipboard!');
  };

  const handleSubmitTrx = async () => {
    if (!transactionId.trim()) {
      toast.error('অনুগ্রহ করে ট্রানজ্যাকশন আইডি দিন!');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Processing order...');

    try {
      const orderData = {
        userId: user?.id || null,
        minecraftUsername: checkoutData.minecraftUsername,
        email: checkoutData.email,
        items,
        total: totalAmount,
        subtotal: getSubtotal(),
        paymentMethod: activeMethod,
        transactionId: transactionId.trim(),
        senderNumber: '',
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      toast.dismiss(toastId);
      setShowSuccess(true);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Try again.', { id: toastId });
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    navigate('/profile');
  };

  const renderGatewaySelection = () => (
    <div className="h-full flex flex-col relative" style={{ display: activeMethod ? 'none' : 'block' }}>
      <div className="p-5 flex-1">
        <div className="bg-white rounded-lg p-3 flex justify-between items-center mb-8 shadow-sm">
          <Link to="/" className="text-[#6b7a99] hover:text-black"><Home className="w-5 h-5" /></Link>
          <button onClick={() => navigate('/checkout')} className="text-[#6b7a99] hover:text-black"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="w-[70px] h-[70px] rounded-full border border-[#c0d1eb] flex justify-center items-center text-center font-bold text-[12px] overflow-hidden bg-white text-[#7a8ba8]">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              settings.websiteName.substring(0, 4)
            )}
          </div>
          <div className="flex-1 ml-4">
            <h2 className="text-[18px] color-[#7a8ba8] mb-2 font-bold uppercase">{settings.websiteName}</h2>
            <div className="flex gap-2">
              <button className="w-[35px] h-[35px] bg-white rounded-lg flex justify-center items-center text-[#7a8ba8] hover:bg-gray-50 shadow-sm"><Headset className="w-4 h-4" /></button>
              <button className="w-[35px] h-[35px] bg-white rounded-lg flex justify-center items-center text-[#7a8ba8] hover:bg-gray-50 shadow-sm"><Info className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#004fb5] text-white text-center p-4 rounded-md font-bold text-[14px] mb-5 shadow-sm border-none">
          Mobile Banking
        </button>

        <div className="flex gap-2.5 flex-wrap justify-between">
          {!hasActiveMethods && (
            <div className="w-full text-center p-4 bg-white rounded-lg text-gray-500 font-bold">
              No payment methods available.
            </div>
          )}
          {Object.entries(methodsInfo).map(([key, gw]) => {
            if (!gw.active) return null;
            return (
              <div 
                key={key} 
                onClick={() => setActiveMethod(key)}
                className="w-[48%] bg-[#f7f9fd] border border-[#d3e1f5] rounded-lg p-4 flex items-center justify-center relative h-[60px] cursor-pointer hover:bg-[#ebf1f9] transition-colors mb-2.5 shadow-sm"
              >
                <div className="absolute top-0 right-0 bg-[#c9e1ff] text-[8px] font-bold px-[5px] py-[2px] pl-[15px] text-black rounded-tr-[7px]" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                  PERSONAL
                </div>
                <span style={{ color: gw.color }} className="font-bold text-[18px]">{gw.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-[#dbeaff] p-5 text-center rounded-t-[15px] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <h3 className="text-[#004fb5] text-[18px] font-bold">Pay {settings.currency}{totalAmount.toFixed(2)}</h3>
      </div>
    </div>
  );

  const renderPaymentPage = () => {
    if (!activeMethod) return null;
    const gw = methodsInfo[activeMethod];
    const invoiceId = `INV${Math.floor(Math.random() * 100000)}`;

    return (
      <div className="h-full bg-[#f2f6fc] overflow-y-auto pb-[80px] relative">
        <div className="flex items-center p-4 bg-white border-b border-[#d3e1f5]">
          <button onClick={() => setActiveMethod(null)} className="mr-4 text-gray-500 hover:text-black">
             <X className="w-5 h-5" />
          </button>
          <div className="w-[40px] h-[40px] rounded-full border border-[#c0d1eb] flex justify-center items-center text-center font-bold text-[8px] overflow-hidden bg-white text-[#7a8ba8]">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              'LOGO'
            )}
          </div>
          <div className="flex-1 ml-3">
            <h2 className="m-0 text-[14px] font-bold text-gray-800 uppercase">{settings.websiteName}</h2>
            <span className="text-[10px] text-[#7a8ba8]">Invoice ID: {invoiceId}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="text-center my-4">
            <span style={{ color: gw.color }} className="text-[24px] font-bold">{gw.name}</span>
          </div>
          
          <div className="rounded-[10px] p-[25px_15px] text-white text-center shadow-lg" style={{ backgroundColor: gw.color }}>
            <h2 className="text-[16px] mb-[15px] font-bold">ট্রানজ্যাকশন আইডি দিন</h2>
            <input 
              type="text" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-[15px] rounded-lg border-none mb-5 font-bold text-[16px] text-center bg-white outline-none focus:ring-2 focus:ring-black/20"
              style={{ color: gw.color }}
              placeholder="ট্রানজ্যাকশন আইডি দিন"
            />
            
            <div className="text-left bg-black/10 rounded-lg p-4">
              <div className="flex items-start pb-3 mb-3 border-b border-white/30 text-[13px] leading-[1.4]">
                <span className="text-[16px] mr-2 -mt-0.5">•</span>
                <span>{gw.ussd} ডায়াল করে আপনার {gw.name} মোবাইল মেনুতে যান অথবা অ্যাপে যান।</span>
              </div>
              <div className="flex items-start pb-3 mb-3 border-b border-white/30 text-[13px] leading-[1.4]">
                <span className="text-[16px] mr-2 -mt-0.5">•</span>
                <span>"Send Money" -এ ক্লিক করুন।</span>
              </div>
              <div className="flex items-start pb-3 mb-3 border-b border-white/30 text-[13px] leading-[1.4]">
                <div className="flex justify-between items-center w-full bg-white/10 p-2 rounded">
                  <span>প্রাপক নম্বর: <b>{gw.number}</b></span>
                  <button 
                    onClick={() => handleCopy(gw.number)}
                    className="bg-black/20 hover:bg-black/30 rounded px-2 py-1 text-[12px] text-white border-none cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              </div>
              <div className="flex items-start pb-3 mb-3 border-b border-white/30 text-[13px] leading-[1.4]">
                <span className="text-[16px] mr-2 -mt-0.5">•</span>
                <span>টাকার পরিমাণ: <b>{settings.currency}{totalAmount.toFixed(2)}</b></span>
              </div>
              <div className="flex items-start pb-3 mb-3 border-b border-white/30 text-[13px] leading-[1.4]">
                <span className="text-[16px] mr-2 -mt-0.5">•</span>
                <span>নিশ্চিত করতে এখন আপনার পিন লিখুন।</span>
              </div>
              <div className="flex items-start text-[13px] leading-[1.4]">
                <span className="text-[16px] mr-2 -mt-0.5">•</span>
                <span>এখন উপরের বক্সে আপনার Transaction ID দিন এবং নিচের VERIFY বাটনে ক্লিক করুন।</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmitTrx}
          disabled={loading}
          className="w-full p-5 text-center fixed sm:absolute bottom-0 left-0 text-white font-bold text-[16px] border-none cursor-pointer disabled:opacity-70 hover:brightness-110 transition-all z-10"
          style={{ backgroundColor: gw.color }}
        >
          {loading ? 'PROCESSING...' : 'VERIFY'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#333] flex justify-center items-center font-sans fixed inset-0 z-50 overflow-y-auto pt-4 pb-4 sm:p-4">
      <div className="w-full max-w-[375px] h-[100dvh] sm:h-[812px] sm:max-h-[812px] bg-[#f2f6fc] relative overflow-hidden sm:shadow-[0_0_20px_rgba(0,0,0,0.5)] sm:rounded-[10px]">
        {renderGatewaySelection()}
        {renderPaymentPage()}

        {/* Success Popup */}
        {showSuccess && (
          <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-[999] p-4 backdrop-blur-sm">
            <div className="bg-white w-[85%] rounded-[10px] p-[30px_20px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
              <div className="w-[70px] h-[70px] rounded-full border-[3px] border-[#e1f5e5] flex justify-center items-center mx-auto mb-[15px]">
                <Check className="w-[35px] h-[35px] text-[#a4e0a9]" />
              </div>
              <h2 className="text-[#444] text-[24px] font-bold mb-[10px]">Success</h2>
              <p className="text-[#666] text-[15px] mb-[25px]">Order Placed Successfully!</p>
              <button 
                onClick={handleCloseSuccess}
                className="bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white border-none py-3 px-[30px] rounded-[5px] text-[16px] font-bold cursor-pointer w-[100px] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
