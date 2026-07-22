const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

file = file.replace(
  "import toast from 'react-hot-toast';",
  "import toast from 'react-hot-toast';\nimport { useSettingsStore } from '../../store/useSettingsStore';"
);

file = file.replace(
  "export default function Products() {",
  "export default function Products() {\n  const { settings } = useSettingsStore();"
);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
