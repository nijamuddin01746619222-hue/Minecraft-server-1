const fs = require('fs');
let file = fs.readFileSync('src/lib/firebase.ts', 'utf8');
if (!file.includes('firebase/database')) {
  file = file.replace("import { getStorage } from 'firebase/storage';", "import { getStorage } from 'firebase/storage';\nimport { getDatabase } from 'firebase/database';");
  file += "\nexport const rtdb = getDatabase(app);";
  fs.writeFileSync('src/lib/firebase.ts', file);
}
