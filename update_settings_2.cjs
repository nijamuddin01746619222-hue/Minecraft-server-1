const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

const targetStr = '<div className="flex flex-col gap-4 p-4 bg-white border-2 border-black rounded-lg">\n            <div>\n              <h3 className="font-bold text-black uppercase">Online Players Count</h3>';

const replacement = `<div className="flex flex-col gap-4 p-4 bg-white border-2 border-black rounded-lg">
            <div>
              <h3 className="font-bold text-black uppercase">Image Upload API (imgBB)</h3>
              <p className="text-xs text-gray-500 font-bold">Configure imgBB API Key for direct image uploads.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ImgBB API Key</label>
              <input type="text" value={formData.imgbbApiKey || ""} onChange={e => setFormData({...formData, imgbbApiKey: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" placeholder="Enter imgBB API key" />
            </div>
          </div>
          
          ${targetStr}`;

file = file.replace(targetStr, replacement);
fs.writeFileSync('src/pages/admin/Settings.tsx', file);
