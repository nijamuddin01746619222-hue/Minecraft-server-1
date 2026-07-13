const fs = require('fs');
let file = fs.readFileSync('src/components/layout/StoreLayout.tsx', 'utf8');

const targetStr = `  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'RANKS', path: '/ranks' },
    { name: 'COINS', path: '/coins' },
    { name: 'HISTORY', path: '/profile' },
    { name: 'SUPPORT', path: '/support' },
  ];`;

const replaceStr = `  const navLinks = [
    { name: 'HOME', path: '/' },
    ...(settings.categories?.filter(c => c.enabled).map(c => ({ name: c.name.toUpperCase(), path: c.link })) || [
      { name: 'RANKS', path: '/ranks' },
      { name: 'COINS', path: '/coins' }
    ])
  ];`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/layout/StoreLayout.tsx', file);
