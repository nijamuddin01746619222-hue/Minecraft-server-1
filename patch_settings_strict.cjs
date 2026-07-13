const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

const targetStr = "          ))}\n          <div>\n            <label className=\"block text-xs font-bold text-gray-500 uppercase mb-2\">Right Side Banner (URL)</label>";

const replaceStr = `              <button type="button" onClick={() => {
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

file = file.replace(targetStr, replaceStr);

if (!file.includes('Plus')) {
    file = file.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Plus } from 'lucide-react';");
}

fs.writeFileSync('src/pages/admin/Settings.tsx', file);
