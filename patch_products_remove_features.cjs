const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `                  <div>
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-4">List Additional Features (Optional)</label>
                <div className="space-y-3">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={feature} onChange={e => handleFeatureChange(idx, e.target.value)} className="flex-1 bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none" placeholder="e.g., Access to /fly command" />
                      <button type="button" onClick={() => removeFeature(idx)} className="p-3 bg-red-100 text-red-500 hover:bg-red-200 border-2 border-black rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addFeature} className="flex items-center gap-2 text-primary font-bold text-sm uppercase px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors border-2 border-transparent hover:border-black">
                    <Plus className="w-4 h-4" /> Add Feature Line
                  </button>
                </div>
              </div>`;

const replaceStr = `                </div>
              )}`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/admin/Products.tsx', file);
