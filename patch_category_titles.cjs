const fs = require('fs');
let file = fs.readFileSync('src/pages/store/CategoryPage.tsx', 'utf8');

const targetStr = `  const categoryTitles: Record<string, string> = {
    ranks: 'Server Ranks',
    coins: 'Pebbles & Coins'
  };`;
const replaceStr = `  const categoryTitles = settings.categories?.reduce((acc, cat) => {
    acc[cat.link.replace('/', '')] = cat.name;
    // Map /coins to coins/pebbles
    if (cat.id === 'pebbles') acc['coins'] = cat.name;
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>) || {
    ranks: 'Server Ranks',
    coins: 'Pebbles & Coins',
    plugins: 'Plugins',
    setups: 'Server Setups',
    textures: 'Textures'
  };`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/store/CategoryPage.tsx', file);
