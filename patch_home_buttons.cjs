const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetStr = `          return (
            <div key={cat.id} className="relative group">
              <Link 
                to={cat.link} 
                className="block h-full bg-white retro-border border-black rounded-xl p-6 overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_8px_0_0_#000] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-pixel text-black mb-2">{cat.name}</h2>
                  <p className="text-gray-600 font-bold text-xs leading-snug">
                    {defaultDesc}
                  </p>
                  <div className="mt-2 text-xs font-bold text-primary">
                    {productCounts[cat.id] || 0} Products
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4 mt-auto">
                  <div className="w-20 h-20 flex items-center justify-center">
                    {cat.icon ? (
                      <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <Zap className="w-12 h-12 text-primary opacity-50 group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <button className="w-full retro-btn py-2 text-sm">
                    View {cat.name}
                  </button>
                </div>
              </Link>`;

const replaceStr = `          return (
            <div key={cat.id} className="relative group/cat">
              <Link 
                to={cat.link} 
                className="group relative bg-primary/20 retro-border border-black rounded-xl p-8 overflow-hidden flex items-center justify-between hover:-translate-y-2 hover:shadow-[0_12px_0_0_#000] hover:bg-primary/30 transition-all duration-300 min-h-[160px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 max-w-[60%]">
                  <h2 className="text-2xl md:text-3xl font-pixel text-black mb-2">{cat.name}</h2>
                  <p className="text-gray-800 font-bold text-xs md:text-sm leading-snug mb-2">
                    {defaultDesc}
                  </p>
                  <div className="inline-block bg-white/50 border border-black px-2 py-1 rounded text-xs font-bold text-black shadow-sm">
                    {productCounts[cat.id] || 0} Products
                  </div>
                </div>
                <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  ) : (
                    <Zap className="w-12 h-12 md:w-16 md:h-16 text-primary opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  )}
                </div>
              </Link>`;

file = file.replace(targetStr, replaceStr);

// Also need to revert the grid structure
const gridTarget = `      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">`;
const gridReplace = `      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">`;
file = file.replace(gridTarget, gridReplace);

fs.writeFileSync('src/pages/store/Home.tsx', file);
