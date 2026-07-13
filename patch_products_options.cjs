const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary">
                        <option value="ranks">Ranks</option>
                        <option value="coins">Coins/Pebbles</option>
                        <option value="custom">Custom</option>
                      </select>`;
const replaceStr = `                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary">
                        <option value="ranks">Ranks</option>
                        <option value="coins">Pebbles (Coins)</option>
                        <option value="plugins">Plugins</option>
                        <option value="setups">Server Setups</option>
                        <option value="textures">Textures</option>
                        <option value="custom">Custom</option>
                      </select>`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
