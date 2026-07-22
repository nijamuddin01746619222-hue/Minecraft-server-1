const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

file = file.replace(
  "{productCounts[cat.id] || 0} Item{productCounts[cat.id] !== 1 ? 's' : ''}",
  "{productCounts[cat.id] || productCounts[cat.link?.replace('/', '')] || 0} Item{(productCounts[cat.id] || productCounts[cat.link?.replace('/', '')]) !== 1 ? 's' : ''}"
);

fs.writeFileSync('src/pages/store/Home.tsx', file);
