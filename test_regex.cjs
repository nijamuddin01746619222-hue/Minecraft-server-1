const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');
let snippet = file.substring(file.indexOf('))}') - 10, file.indexOf('))}') + 50);
console.log(JSON.stringify(snippet));
