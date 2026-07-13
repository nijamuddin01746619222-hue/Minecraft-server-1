const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `        image: product.image || '',
        rankData: { ...defaultForm.rankData, ...(product.rankData || {}) }
      });`;
const replaceStr = `        image: product.image || '',
        rankData: { ...defaultForm.rankData, ...(product.rankData || {}) },
        gallery: product.gallery || [],
        productLink: product.productLink || '',
        linkExpiry: product.linkExpiry || 'Lifetime'
      });`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/admin/Products.tsx', file);
