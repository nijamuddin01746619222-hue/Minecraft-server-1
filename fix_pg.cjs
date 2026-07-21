const fs = require('fs');
let file = fs.readFileSync('src/pages/store/PaymentGateway.tsx', 'utf8');

if (!file.includes("import { rtdb }")) {
  file = file.replace(
    "import { collection, addDoc, serverTimestamp } from 'firebase/firestore';",
    "import { collection, addDoc, serverTimestamp, query as fsQuery, where, getDocs } from 'firebase/firestore';\nimport { rtdb } from '../../lib/firebase';\nimport { ref, get, query as rtdbQuery, orderByChild, equalTo } from 'firebase/database';"
  );
}

const replacement = `  const handleSubmitTrx = async () => {
    if (!transactionId.trim()) {
      toast.error('অনুগ্রহ করে ট্রানজ্যাকশন আইডি দিন!');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Processing order...');

    try {
      const isAutoPay = settings.autoPayment?.enabled;
      let orderStatus = 'pending';

      if (isAutoPay) {
        // 1. Check if txid already used
        const usedQ = fsQuery(collection(db, 'usedTransactions'), where('txid', '==', transactionId.trim()));
        const usedSnap = await getDocs(usedQ);
        if (!usedSnap.empty) {
          toast.error('এই ট্রানজেকশন আইডিটি ইতিমধ্যে ব্যবহারিত হয়েছে');
          setLoading(false);
          toast.dismiss(toastId);
          return;
        }

        // 2. Find txid in Realtime DB
        const txRef = ref(rtdb, 'XNXANIKPAY');
        const q = rtdbQuery(txRef, orderByChild('txid'), equalTo(transactionId.trim()));
        const snapshot = await get(q);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const txs = Object.values(data) as any[];
          const tx = txs[0];
          
          // Note: we can optionally check amount if needed: if (tx.amount >= totalAmount)
          // The prompt says: "যত টাকা পাঠাইছে সেটি ইউজারের প্রোডাক্ট ক্রয় হয়ে যাবে"
          // We will mark it as completed since we found it
          orderStatus = 'completed';

          // 3. Mark as used
          await addDoc(collection(db, 'usedTransactions'), {
            txid: transactionId.trim(),
            method: activeMethod,
            amount: tx.amount,
            username: checkoutData.minecraftUsername,
            email: checkoutData.email,
            usedAt: serverTimestamp()
          });

        } else {
          toast.error('Transaction ID not found');
          setLoading(false);
          toast.dismiss(toastId);
          return;
        }
      }

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
        status: orderStatus,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      toast.dismiss(toastId);
      setShowSuccess(true);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process payment');
      toast.dismiss(toastId);
      setLoading(false);
    }
  };`;

file = file.replace(/  const handleSubmitTrx = async \(\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?setLoading\(false\);\n    \}\n  \};/m, replacement);

fs.writeFileSync('src/pages/store/PaymentGateway.tsx', file);
