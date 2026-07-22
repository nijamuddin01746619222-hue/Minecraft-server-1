const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const fetchLogic = `    const fetchProductCounts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const counts = {};
        snap.docs.forEach(doc => {
          const cat = doc.data().category;
          if (cat) {
            counts[cat] = (counts[cat] || 0) + 1;
          }
        });
        setProductCounts(counts);
      } catch (e) {
        console.error('Error fetching product counts:', e);
      }
    };
    fetchProductCounts();
`;

file = file.replace(
  "    const fetchRecentOrders = async () => {",
  fetchLogic + "\n    const fetchRecentOrders = async () => {"
);

fs.writeFileSync('src/pages/store/Home.tsx', file);
