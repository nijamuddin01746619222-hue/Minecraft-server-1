const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `        <h1 className="text-3xl font-pixel text-black tracking-widest">Products</h1>`;
const replaceStr = `        <h1 className="text-3xl font-pixel text-black tracking-widest capitalize">{categoryFilter}</h1>`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
