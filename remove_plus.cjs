const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const regex1 = /\{\(isAdminLoggedIn\s*\|\|\s*user\?\.role === 'admin'\s*\|\|\s*user\?\.role === 'super_admin'\)\s*&&\s*\(\s*<button[\s\S]*?<\/button>\s*\)\}/g;
file = file.replace(regex1, '');

const regex2 = /\{\(isAdminLoggedIn\s*\|\|\s*user\?\.role === 'admin'\s*\|\|\s*user\?\.role === 'super_admin'\)\s*&&\s*\(\s*<div className="relative group\/cat">[\s\S]*?<\/div>\s*\)\}/g;
file = file.replace(regex2, '');

fs.writeFileSync('src/pages/store/Home.tsx', file);
