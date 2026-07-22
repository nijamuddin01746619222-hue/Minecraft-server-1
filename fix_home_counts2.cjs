const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

file = file.replace(
  "if (cat) {",
  "if (cat && doc.data().enabled !== false) {"
);

fs.writeFileSync('src/pages/store/Home.tsx', file);
