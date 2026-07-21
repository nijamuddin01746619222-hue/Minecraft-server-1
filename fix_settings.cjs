const fs = require('fs');
let file = fs.readFileSync('src/store/useSettingsStore.ts', 'utf8');

file = file.replace(
  "  paymentMethods: {",
  "  autoPayment: { enabled: boolean; };\n  paymentMethods: {"
);

file = file.replace(
  "  paymentMethods: {",
  "  autoPayment: { enabled: false },\n  paymentMethods: {"
);

fs.writeFileSync('src/store/useSettingsStore.ts', file);
