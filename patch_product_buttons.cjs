const fs = require('fs');
let file = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

file = file.replace('className="w-full retro-btn py-4 text-lg bg-green-400 hover:bg-green-500"', 'className="w-full retro-btn py-4 text-lg"');

fs.writeFileSync('src/pages/store/ProductDetails.tsx', file);
