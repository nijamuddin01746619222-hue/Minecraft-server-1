const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

file = file.replace("import { Plus, Edit, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';", "import { Plus, Edit, Trash2, Image as ImageIcon, Save, X, Upload } from 'lucide-react';\nimport ImageUpload from '../../components/ui/ImageUpload';");

file = file.replace(
  /<input type="text" value=\{formData\.image\} onChange=\{e => setFormData\(\{\.\.\.formData, image: e\.target\.value\}\)\} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="Image URL\.\.\." \/>/g,
  '<div className="w-full"><ImageUpload value={formData.image || ""} onChange={url => setFormData({...formData, image: url})} /></div>'
);

file = file.replace(
  /<input type="text" value=\{formData\.rankData\?\.namePrefixImage \|\| ''\} onChange=\{e => setFormData\(\{\.\.\.formData, rankData: \{\.\.\.formData\.rankData!, namePrefixImage: e\.target\.value\}\}\)\} className="w-full bg-gray-50 border-2 border-black rounded-lg p-3 text-black font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="URL\.\.\." \/>/g,
  '<ImageUpload value={formData.rankData?.namePrefixImage || ""} onChange={url => setFormData({...formData, rankData: {...formData.rankData!, namePrefixImage: url}})} placeholder="URL..." />'
);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
