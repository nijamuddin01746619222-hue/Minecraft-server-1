const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `              <div className="border-t-2 border-black pt-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-4">List Additional Features (Optional)</label>`;
const replaceStr = `              {['plugins', 'setups', 'textures'].includes(formData.category) && (
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
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link Expiry Time</label>
                    <select value={formData.linkExpiry || '7 Days'} onChange={e => setFormData({...formData, linkExpiry: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary">
                      <option value="Lifetime">Lifetime</option>
                      <option value="24 Hours">24 Hours</option>
                      <option value="48 Hours">48 Hours</option>
                      <option value="3 Days">3 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="border-t-2 border-black pt-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-4">List Additional Features (Optional)</label>`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
