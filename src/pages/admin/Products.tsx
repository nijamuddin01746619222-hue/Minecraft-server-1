import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';
import ImageUpload from '../../components/ui/ImageUpload';
import toast from 'react-hot-toast';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function Products() {
  const { settings } = useSettingsStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultForm = {
    name: '',
    description: '',
    fullDescription: '',
    category: 'ranks',
    price: 0,
    salePrice: 0,
    enabled: true,

    image: '',
    gallery: [] as string[],
    productLink: '',
    linkExpiry: '7 Days',
    rankData: {
      namePrefixImage: '',
      exclusiveTag: '',
      setHome: '',
      dailyFlight: '',
      auctionHouseSlot: '',
      claimBlocks: '',
      crateKeys: '',
      playerVault: '',
      jobBooster: '',
      playerWarp: '',
      discordRole: '',
      accessTo: ''
    } as Record<string, any>
  };

  const [searchParams] = useSearchParams();
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
  }, [categoryFilter, searchParams]);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        fullDescription: product.fullDescription || '',
        category: product.category || 'ranks',
        price: product.price || 0,
        salePrice: product.salePrice || 0,
        enabled: product.enabled ?? true,

        image: product.image || '',
        rankData: { ...defaultForm.rankData, ...(product.rankData || {}) },
        gallery: product.gallery || [],
        productLink: product.productLink || '',
        linkExpiry: product.linkExpiry || 'Lifetime'
      });
    } else {
      setEditingId(null);
      setFormData({...defaultForm, category: categoryFilter === 'all' ? 'ranks' : categoryFilter});
    }
    setIsModalOpen(true);
  };



  const handleRankDataChange = (featureId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      rankData: { ...prev.rankData, [featureId]: value }
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const toastId = toast.loading('Saving product...');
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
        image: formData.image,

      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      toast.success(editingId ? 'Product updated' : 'Product created', { id: toastId });
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Error saving product', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const toastId = toast.loading('Deleting...');
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success('Deleted successfully', { id: toastId });
        fetchProducts();
      } catch (e: any) {
        toast.error('Failed to delete', { id: toastId });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-pixel text-black tracking-widest capitalize">{categoryFilter === 'all' ? 'All Products' : categoryFilter}</h1>
        <button onClick={() => handleOpenModal()} className="retro-btn px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="retro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b-2 border-black">
              <tr>
                <th className="p-4 font-bold text-xs uppercase text-gray-500">Image</th>
                <th className="p-4 font-bold text-xs uppercase text-gray-500">Name</th>
                <th className="p-4 font-bold text-xs uppercase text-gray-500">Category</th>
                <th className="p-4 font-bold text-xs uppercase text-gray-500">Price</th>
                <th className="p-4 font-bold text-xs uppercase text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-10 h-10 object-cover rounded bg-gray-200 border border-black" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded border border-black flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-400" /></div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-black">{product.name}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-200 text-xs font-bold rounded uppercase">{product.category}</span></td>
                  <td className="p-4">
                    <div className="font-bold">
                      {product.salePrice > 0 ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">{product.price}</span>
                          <span className="text-primary">{product.salePrice}</span>
                        </>
                      ) : (
                        <span>{product.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${product.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.enabled ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded mr-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold">No products found. Create one above!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 z-[9999] overflow-y-auto">
          <div className="bg-white retro-border border-black rounded-xl w-full max-w-4xl shadow-2xl relative my-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-gray-500 hover:text-black">
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6 border-b-2 border-black bg-gray-50">
              <h2 className="text-2xl font-pixel text-black">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Noble Rank" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Regular Price</label>
                      <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value as any})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sale Price (Optional)</label>
                      <input type="number" min="0" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value as any})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                      
  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary">
    {settings.categories?.filter(c => c.enabled).map(c => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))}
    <option value="ranks">Ranks</option>
    <option value="coins">Pebbles (Coins)</option>
    <option value="plugins">Plugins</option>
    <option value="setups">Server Setups</option>
    <option value="textures">Textures</option>
  </select>
  
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                      <select value={formData.enabled ? 'true' : 'false'} onChange={e => setFormData({...formData, enabled: e.target.value === 'true'})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary">
                        <option value="true">Active</option>
                        <option value="false">Hidden</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Image (URL)</label>
                    <div className="flex items-center gap-4">
                      {formData.image ? (
                        <div className="w-20 h-20 bg-gray-50 rounded-lg border-2 border-black overflow-hidden shrink-0"><img src={formData.image} alt="Preview" className="w-full h-full object-cover" /></div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-50 rounded-lg border-2 border-black border-dashed flex items-center justify-center shrink-0"><ImageIcon className="w-8 h-8 text-gray-400" /></div>
                      )}
                      <div className="w-full"><ImageUpload value={formData.image || ""} onChange={url => setFormData({...formData, image: url})} /></div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Short Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black outline-none h-16 text-sm font-bold" placeholder="Brief summary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Description</label>
                    <textarea value={formData.fullDescription} onChange={e => setFormData({...formData, fullDescription: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black outline-none h-24 text-sm font-bold" placeholder="Detailed description for the product page" />
                  </div>
                </div>
              </div>

              {formData.category === 'ranks' && (
                <div className="border-t-2 border-black pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-pixel text-black">Rank Features</h3>
                    <p className="text-xs text-gray-500 font-bold">Configure details for this rank</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'namePrefixImage', label: 'Name Prefix (Image URL)', placeholder: 'https://...' },
                      { id: 'exclusiveTag', label: 'Exclusive Tag', placeholder: 'e.g. DONOR' },
                      { id: 'setHome', label: 'Set Home', placeholder: 'e.g. 3' },
                      { id: 'dailyFlight', label: 'Daily Flight', placeholder: 'e.g. 30s' },
                      { id: 'auctionHouseSlot', label: 'Auction House Slot', placeholder: 'e.g. 10' },
                      { id: 'claimBlocks', label: 'Claim Blocks', placeholder: 'e.g. 2000' },
                      { id: 'crateKeys', label: 'Crate Keys', placeholder: 'e.g. 3x Aqua Keys' },
                      { id: 'playerVault', label: 'Player Vault', placeholder: 'e.g. 3x' },
                      { id: 'jobBooster', label: 'Job Booster', placeholder: 'e.g. 25%' },
                      { id: 'playerWarp', label: 'Player Warp', placeholder: 'e.g. 1' },
                      { id: 'discordRole', label: 'Discord Role', placeholder: 'Yes/No', isBoolean: true },
                      { id: 'accessTo', label: 'Access to (Commands)', placeholder: 'e.g. /ec, /hat, /shop' },
                    ].map(field => (
                      <div key={field.id} className="bg-gray-50 p-3 rounded-lg border-2 border-black">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">{field.label}</label>
                        {field.isBoolean ? (
                          <select 
                            value={formData.rankData[field.id] || 'Yes'}
                            onChange={e => handleRankDataChange(field.id, e.target.value)}
                            className="w-full bg-white border-2 border-black rounded p-2 text-sm font-bold"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          field.id === 'namePrefixImage' ? (
                            <ImageUpload 
                              value={formData.rankData[field.id] || ''} 
                              onChange={url => handleRankDataChange(field.id, url)} 
                              placeholder={field.placeholder} 
                            />
                          ) : (
                            <input 
                              type="text"
                              value={formData.rankData[field.id] || ''}
                              onChange={e => handleRankDataChange(field.id, e.target.value)}
                              className="w-full bg-white border-2 border-black rounded p-2 text-sm font-bold"
                              placeholder={field.placeholder}
                            />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {['plugins', 'setups', 'textures'].includes(formData.category) && (
                <div className="border-t-2 border-black pt-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Additional Images (Gallery)</label>
                    <div className="space-y-3">
                      {(formData.gallery || []).map((img, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="flex-1">
                            <ImageUpload value={img} onChange={url => {
                              const newGallery = [...(formData.gallery || [])];
                              newGallery[idx] = url;
                              setFormData({...formData, gallery: newGallery});
                            }} />
                          </div>
                          <button type="button" onClick={() => {
                            const newGallery = [...(formData.gallery || [])];
                            newGallery.splice(idx, 1);
                            setFormData({...formData, gallery: newGallery});
                          }} className="p-3 bg-red-100 text-red-500 hover:bg-red-200 border-2 border-black rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, gallery: [...(formData.gallery || []), '']})} className="flex items-center gap-2 text-primary font-bold text-sm uppercase px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors border-2 border-transparent hover:border-black">
                        <Plus className="w-4 h-4" /> Add Image
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">After Purchase, Redirect Link (Product Link)</label>
                    <input type="text" required value={formData.productLink || ''} onChange={e => setFormData({...formData, productLink: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. https://fiexfall.fun/downloads/..." />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t-2 border-black">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-600 hover:text-black uppercase border-2 border-transparent hover:border-black rounded-lg transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="retro-btn px-8 py-3">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
