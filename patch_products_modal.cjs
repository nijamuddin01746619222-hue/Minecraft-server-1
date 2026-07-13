const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

file = file.replace(`setFormData({...defaultForm, category: categoryFilter});`, `setFormData({...defaultForm, category: categoryFilter === 'all' ? 'ranks' : categoryFilter});`);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
