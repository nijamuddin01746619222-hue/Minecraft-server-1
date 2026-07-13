const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetStr = `<p className="text-black/70 font-medium text-[10px] sm:text-xs leading-tight">
                    {defaultDesc}
                  </p>`;

const replaceStr = `<p className="text-black/70 font-medium text-[10px] sm:text-xs leading-tight">
                    {defaultDesc}
                  </p>
                  <p className="mt-1.5 text-black font-bold text-[10px] sm:text-[11px] opacity-70">
                    {productCounts[cat.id] || 0} Item{productCounts[cat.id] !== 1 ? 's' : ''}
                  </p>`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/store/Home.tsx', file);
