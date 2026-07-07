const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // replace specific classes
  content = content.replace(/bg-\[#0b0f19\]/g, 'bg-background');
  content = content.replace(/bg-\[#151c2c\]/g, 'bg-white retro-border');
  content = content.replace(/border-gray-800/g, 'border-black');
  content = content.replace(/text-white/g, 'text-black');
  content = content.replace(/text-gray-400/g, 'text-gray-600');
  content = content.replace(/text-gray-500/g, 'text-gray-700');
  content = content.replace(/text-gray-300/g, 'text-gray-800');
  content = content.replace(/shadow-\[0_0_15px_rgba\(0,229,255,0\.3\)\]/g, 'retro-shadow');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(file);
    }
  }
}

walk('./src');
console.log('Done replacing theme classes');
