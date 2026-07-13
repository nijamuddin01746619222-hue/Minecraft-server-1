const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

const targetStr = `          <h2 className="text-xl font-bold font-pixel">Category Buttons (Homepage)</h2>
        </div>
        <div className="p-6 space-y-4">
          {formData.categories?.map((cat, idx) => (`;
          
const replaceStr = `          <h2 className="text-xl font-bold font-pixel">Category Buttons (Homepage)</h2>
        </div>
        <div className="p-6 space-y-4">
          {formData.categories?.map((cat, idx) => (`;
          
// wait, I can just append the add button after the map.
// Let's find the end of the map.
const mapEndTarget = `              </div>
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Right Side Banner (URL)</label>`;
const mapEndReplace = `              </div>
              <button type="button" onClick={() => {
                const newCats = [...(formData.categories || [])];
                newCats.splice(idx, 1);
                setFormData({...formData, categories: newCats});
              }} className="mt-4 px-4 py-2 bg-red-100 text-red-600 border-2 border-red-600 rounded font-bold text-xs hover:bg-red-200 transition-colors">
                Remove Button
              </button>
            </div>
          ))}
          <button type="button" onClick={() => {
            const newCats = [...(formData.categories || [])];
            newCats.push({ id: 'cat_' + Date.now(), name: 'New Button', icon: '', link: '/', enabled: true });
            setFormData({...formData, categories: newCats});
          }} className="w-full py-3 bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 font-bold hover:bg-gray-200 hover:text-black transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add New Button
          </button>
          <div className="pt-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Right Side Banner (URL)</label>`;

file = file.replace(mapEndTarget, mapEndReplace);

// Also need to make sure Plus is imported if not already
if (!file.includes('Plus')) {
    file = file.replace(`import { SettingsIcon, Save, Image as ImageIcon, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react';`, `import { SettingsIcon, Save, Image as ImageIcon, Link as LinkIcon, Edit2, Trash2, Plus } from 'lucide-react';`);
}

fs.writeFileSync('src/pages/admin/Settings.tsx', file);
