const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'ranks';

  const [formData, setFormData] = useState(defaultForm);
  

  const fetchProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => p.category === categoryFilter));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);`;

const replaceStr = `  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';

  const [formData, setFormData] = useState(defaultForm);
  

  const fetchProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => categoryFilter === 'all' || p.category === categoryFilter));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    if (searchParams.get('add') === 'true') {
      // Need a small timeout to let the modal state update correctly if we just navigated
      setTimeout(() => {
        handleOpenModal();
      }, 100);
    }
  }, [categoryFilter, searchParams]);`;

file = file.replace(targetStr, replaceStr);

const targetTitle = `<h1 className="text-3xl font-pixel text-black tracking-widest capitalize">{categoryFilter}</h1>`;
const replaceTitle = `<h1 className="text-3xl font-pixel text-black tracking-widest capitalize">{categoryFilter === 'all' ? 'All Products' : categoryFilter}</h1>`;

file = file.replace(targetTitle, replaceTitle);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
