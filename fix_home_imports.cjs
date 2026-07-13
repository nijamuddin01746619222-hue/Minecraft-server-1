const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

if (!file.includes("useAuthStore")) {
  console.log("No useAuthStore found");
}

file = file.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link, useNavigate } from 'react-router-dom';"
);

if (!file.includes("import { useAuthStore }")) {
  file = file.replace(
    "import { useSettingsStore } from '../../store/useSettingsStore';",
    "import { useSettingsStore } from '../../store/useSettingsStore';\nimport { useAuthStore } from '../../store/useAuthStore';"
  );
}

if (!file.includes("import { Plus }") && !file.includes("Plus,")) {
  file = file.replace(
    "import { Users, Award, Zap, History } from 'lucide-react';",
    "import { Users, Award, Zap, History, Plus } from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/store/Home.tsx', file);
