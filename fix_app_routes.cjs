const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

if (!file.includes('import AutoPay')) {
  file = file.replace(
    "import Settings from './pages/admin/Settings';",
    "import Settings from './pages/admin/Settings';\nimport AutoPay from './pages/admin/AutoPay';"
  );
  file = file.replace(
    '<Route path="settings" element={<Settings />} />',
    '<Route path="settings" element={<Settings />} />\n            <Route path="autopay" element={<AutoPay />} />'
  );
  fs.writeFileSync('src/App.tsx', file);
}
