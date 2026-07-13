const fs = require('fs');
let file = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

const targetStr = `                  const mainImg = document.getElementById('main-product-image');
                  if (mainImg) mainImg.src = img;`;
const replaceStr = `                  const mainImg = document.getElementById('main-product-image') as HTMLImageElement;
                  if (mainImg) mainImg.src = img;`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/store/ProductDetails.tsx', file);
