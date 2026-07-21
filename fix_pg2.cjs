const fs = require('fs');
let file = fs.readFileSync('src/pages/store/PaymentGateway.tsx', 'utf8');

if (!file.includes("import { doc, updateDoc, increment }")) {
  file = file.replace(
    "import { collection, addDoc, serverTimestamp, query as fsQuery, where, getDocs } from 'firebase/firestore';",
    "import { collection, addDoc, serverTimestamp, query as fsQuery, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';"
  );
}

const updateSpentLogic = `
      await addDoc(collection(db, 'orders'), orderData);
      
      if (orderStatus === 'approved' && user?.id) {
        try {
          await updateDoc(doc(db, 'users', user.id), {
            totalSpent: increment(totalAmount)
          });
        } catch (e) {
          console.error('Error updating user spent:', e);
        }
      }
      
      clearCart();`;

file = file.replace(/      await addDoc\(collection\(db, 'orders'\), orderData\);\n      \n      clearCart\(\);/, updateSpentLogic);

fs.writeFileSync('src/pages/store/PaymentGateway.tsx', file);
