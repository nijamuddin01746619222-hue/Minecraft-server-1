const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

file = file.replace("import { Plus, Trash2, GripVertical } from 'lucide-react';", "import { Plus, Trash2, GripVertical, Upload } from 'lucide-react';\nimport ImageUpload from '../../components/ui/ImageUpload';");

file = file.replace(
  /<div className="flex items-center gap-4">\s*<input type="text" placeholder="Image URL \(e\.g\. https:\/\/...\)" value={formData\.logoUrl \|\| ''} onChange=\{e => setFormData\(\{\.\.\.formData, logoUrl: e\.target\.value\}\)\} className="flex-1 bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" \/>\s*<\/div>/g,
  '<ImageUpload value={formData.logoUrl || ""} onChange={url => setFormData({...formData, logoUrl: url})} />'
);

file = file.replace(
  /<div className="flex items-center gap-4">\s*<input type="text" placeholder="Banner image beside logo..." value={formData\.headerBannerUrl \|\| ''} onChange=\{e => setFormData\(\{\.\.\.formData, headerBannerUrl: e\.target\.value\}\)\} className="flex-1 bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" \/>\s*<\/div>/g,
  '<ImageUpload value={formData.headerBannerUrl || ""} onChange={url => setFormData({...formData, headerBannerUrl: url})} placeholder="Banner image beside logo..." />'
);

file = file.replace(
  /<div className="flex items-center gap-4">\s*<input type="text" placeholder="Image URL \(e\.g\. https:\/\/...\)" value={formData\.homeRanksImage \|\| ''} onChange=\{e => setFormData\(\{\.\.\.formData, homeRanksImage: e\.target\.value\}\)\} className="flex-1 bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" \/>\s*<\/div>/g,
  '<ImageUpload value={formData.homeRanksImage || ""} onChange={url => setFormData({...formData, homeRanksImage: url})} />'
);

file = file.replace(
  /<div className="flex items-center gap-4">\s*<input type="text" placeholder="Image URL \(e\.g\. https:\/\/...\)" value={formData\.homePebblesImage \|\| ''} onChange=\{e => setFormData\(\{\.\.\.formData, homePebblesImage: e\.target\.value\}\)\} className="flex-1 bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" \/>\s*<\/div>/g,
  '<ImageUpload value={formData.homePebblesImage || ""} onChange={url => setFormData({...formData, homePebblesImage: url})} />'
);

file = file.replace(
  /<div className="flex items-center gap-4">\s*<input type="text" placeholder="Image URL \(e\.g\. https:\/\/...\)" value={formData\.rightSideBanner \|\| ""} onChange=\{e => setFormData\(\{\.\.\.formData, rightSideBanner: e\.target\.value\}\)\} className="flex-1 bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" \/>\s*<\/div>/g,
  '<ImageUpload value={formData.rightSideBanner || ""} onChange={url => setFormData({...formData, rightSideBanner: url})} />'
);

// Add API Key section
file = file.replace(
  /(<div className="bg-white rounded-xl border-2 border-black p-6 mb-8">\s*<h2 className="text-xl font-bold text-black mb-4 uppercase">Visuals & Branding<\/h2>)/,
  '<div className="bg-white rounded-xl border-2 border-black p-6 mb-8">\n          <h2 className="text-xl font-bold text-black mb-4 uppercase">Image Upload API (imgBB)</h2>\n          <div>\n            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ImgBB API Key</label>\n            <input type="text" value={formData.imgbbApiKey || ""} onChange={e => setFormData({...formData, imgbbApiKey: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg p-3 text-black font-bold outline-none" placeholder="Enter imgBB API key" />\n            <p className="text-xs text-gray-500 mt-1 font-bold">This key is used for all image uploads from the admin panel.</p>\n          </div>\n        </div>\n\n        $1'
);

fs.writeFileSync('src/pages/admin/Settings.tsx', file);
