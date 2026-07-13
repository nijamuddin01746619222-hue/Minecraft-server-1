const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `          <Route path="ranks" element={<CategoryPage type="ranks" />} />
          <Route path="coins" element={<CategoryPage type="coins" />} />`;

const replaceStr = `          <Route path="ranks" element={<CategoryPage type="ranks" />} />
          <Route path="coins" element={<CategoryPage type="coins" />} />
          <Route path="plugins" element={<CategoryPage type="plugins" />} />
          <Route path="setups" element={<CategoryPage type="setups" />} />
          <Route path="textures" element={<CategoryPage type="textures" />} />`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', file);
