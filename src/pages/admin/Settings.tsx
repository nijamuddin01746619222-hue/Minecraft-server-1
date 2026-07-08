import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useSettingsStore, SiteSettings } from '../../store/useSettingsStore';
import toast from 'react-hot-toast';
import { Plus, Trash2, GripVertical, Upload } from 'lucide-react';
import ImageUpload from '../../components/ui/ImageUpload';

export default function Settings() {
  const { settings } = useSettingsStore();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Saving settings...');

    try {
      const newSettings = {
        ...formData,
      };

      await setDoc(doc(db, 'settings', 'global'), newSettings);
      toast.success('Settings saved', { id: toastId });
    } catch (error: any) {
      toast.error('Error: ' + error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const addRankFeature = () => {
    const newFeature = { id: Date.now().toString(), name: 'New Feature', type: 'text' as const, visible: true, order: (formData.rankFeatures?.length || 0) + 1 };
    setFormData({ ...formData, rankFeatures: [...(formData.rankFeatures || []), newFeature] });
  };

  const updateRankFeature = (id: string, updates: any) => {
    setFormData({
      ...formData,
      rankFeatures: (formData.rankFeatures || []).map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const deleteRankFeature = (id: string) => {
    setFormData({
      ...formData,
      rankFeatures: (formData.rankFeatures || []).filter(f => f.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-pixel text-black tracking-widest">Settings</h1>
        <button onClick={handleSubmit} disabled={loading} className="retro-btn px-6 py-3 text-sm">
          {loading ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>

      <div className="retro-card overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-gray-50">
          <h2 className="text-xl font-bold font-pixel">General Details</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Website Name</label>
              <input type="text" value={formData.websiteName} onChange={e => setFormData({...formData, websiteName: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Server IP</label>
              <input type="text" value={formData.serverIp} onChange={e => setFormData({...formData, serverIp: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Currency Symbol</label>
              <input type="text" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Discord Link</label>
              <input type="text" value={formData.discordLink} onChange={e => setFormData({...formData, discordLink: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white border-2 border-black rounded-lg">
            <div>
              <h3 className="font-bold text-black uppercase">Maintenance Mode</h3>
              <p className="text-xs text-gray-500 font-bold">Only admins can access the store when this is active.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.maintenanceMode || false} onChange={e => setFormData({...formData, maintenanceMode: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-black"></div>
            </label>
          </div>
          
          <div className="flex flex-col gap-4 p-4 bg-white border-2 border-black rounded-lg">
            <div>
              <h3 className="font-bold text-black uppercase">Image Upload API (imgBB)</h3>
              <p className="text-xs text-gray-500 font-bold">Configure imgBB API Key for direct image uploads.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ImgBB API Key</label>
              <input type="text" value={formData.imgbbApiKey || ""} onChange={e => setFormData({...formData, imgbbApiKey: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" placeholder="Enter imgBB API key" />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 p-4 bg-white border-2 border-black rounded-lg">
            <div>
              <h3 className="font-bold text-black uppercase">Online Players Count</h3>
              <p className="text-xs text-gray-500 font-bold">Configure how the online players number is shown.</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.onlinePlayers?.random ?? true} onChange={e => setFormData({...formData, onlinePlayers: { ...formData.onlinePlayers, random: e.target.checked }})} className="w-5 h-5" />
                <span className="font-bold text-sm">Random (Changes hourly between 13-102)</span>
              </label>
            </div>
            {(!formData.onlinePlayers?.random) && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Custom Player Count</label>
                <input type="number" min="0" value={formData.onlinePlayers?.count || 0} onChange={e => setFormData({...formData, onlinePlayers: { ...formData.onlinePlayers, count: parseInt(e.target.value) || 0 }})} className="w-full sm:w-1/2 bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo Image (URL)</label>
            <ImageUpload value={formData.logoUrl || ""} onChange={url => setFormData({...formData, logoUrl: url})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Header / Logo Side Banner (URL)</label>
            <ImageUpload value={formData.headerBannerUrl || ""} onChange={url => setFormData({...formData, headerBannerUrl: url})} placeholder="Banner image beside logo..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Store Banner (URL)</label>
            <div className="flex items-center gap-4">
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Home Page - "Ranks" Button Image</label>
            <ImageUpload value={formData.homeRanksImage || ""} onChange={url => setFormData({...formData, homeRanksImage: url})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Home Page - "Pebbles" Button Image</label>
            <ImageUpload value={formData.homePebblesImage || ""} onChange={url => setFormData({...formData, homePebblesImage: url})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Right Side Banner (URL)</label>
            <ImageUpload value={formData.rightSideBanner || ""} onChange={url => setFormData({...formData, rightSideBanner: url})} />
          </div>
        </div>
      </div>
      
      <div className="retro-card overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-gray-50">
          <h2 className="text-xl font-bold font-pixel">Payment Methods</h2>
        </div>
        <div className="p-6 space-y-6">
          {['bkash', 'nagad', 'rocket'].map((method) => {
            const data = (formData.paymentMethods as any)[method];
            return (
              <div key={method} className="flex flex-col gap-4 p-4 border-2 border-black rounded-lg bg-gray-50">
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={data.enabled} onChange={e => setFormData({
                    ...formData, paymentMethods: { ...formData.paymentMethods, [method]: { ...data, enabled: e.target.checked } }
                  })} className="w-5 h-5" />
                  <h3 className="font-bold uppercase text-lg">{method}</h3>
                </div>
                {data.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-9">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Number</label>
                      <input type="text" value={data.number} onChange={e => setFormData({
                        ...formData, paymentMethods: { ...formData.paymentMethods, [method]: { ...data, number: e.target.value } }
                      })} className="w-full bg-white border-2 border-black rounded p-2 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Account Type</label>
                      <select value={data.type} onChange={e => setFormData({
                        ...formData, paymentMethods: { ...formData.paymentMethods, [method]: { ...data, type: e.target.value } }
                      })} className="w-full bg-white border-2 border-black rounded p-2 font-bold">
                        <option value="Personal">Personal</option>
                        <option value="Agent">Agent</option>
                        <option value="Merchant">Merchant</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
