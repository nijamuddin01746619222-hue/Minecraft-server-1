const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Cart.tsx', 'utf8');

file = file.replace(
  "({items.length} items)",
  "({items.reduce((acc, item) => acc + item.quantity, 0)} items)"
);

fs.writeFileSync('src/pages/store/Cart.tsx', file);
