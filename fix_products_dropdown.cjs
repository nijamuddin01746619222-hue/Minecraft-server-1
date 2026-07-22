const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

file = file.replace(
  /<select value={formData\.category}.*?>[\s\S]*?<\/select>/,
  `
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
  `
);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
