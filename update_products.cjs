const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `    image: '',
    rankData: {`;
const replaceStr = `    image: '',
    gallery: [] as string[],
    productLink: '',
    linkExpiry: '7 Days',
    rankData: {`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
