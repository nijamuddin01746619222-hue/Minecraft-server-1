const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetGrid = `<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">`;
const replaceGrid = `<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
file = file.replace(targetGrid, replaceGrid);

const targetBtn = `<Link 
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

const replaceBtn = `<Link 
                to={cat.link} 
                className="group relative bg-[#c6f0e3] border border-black rounded-xl p-6 overflow-hidden flex items-center justify-between transition-all duration-300 min-h-[120px]"
              >
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-2xl md:text-3xl font-pixel text-black mb-2 tracking-wide">{cat.name}</h2>
                  <p className="text-gray-800 font-medium text-xs md:text-sm leading-snug">
                    {defaultDesc}
                  </p>
                </div>
                <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
                  ) : (
                    <Zap className="w-10 h-10 md:w-12 md:h-12 text-black opacity-50" />
                  )}
                </div>
              </Link>`;

file = file.replace(targetBtn, replaceBtn);

const targetAddBtn = `<Link 
              to="/admin/settings" 
              className="group relative bg-gray-50 border-2 border-dashed border-gray-400 rounded-xl p-8 overflow-hidden flex items-center justify-between hover:-translate-y-2 hover:shadow-[0_12px_0_0_#000] hover:border-black hover:bg-gray-100 transition-all duration-300 min-h-[160px]"
            >
              <div className="relative z-10 max-w-[60%]">
                <h2 className="text-2xl md:text-3xl font-pixel text-gray-600 group-hover:text-black mb-2">Add Category</h2>
                <p className="text-gray-500 font-bold text-xs md:text-sm leading-snug">
                  Configure in Settings
                </p>
              </div>
              <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-200 group-hover:bg-primary/20 rounded-full transition-colors">
                <Plus className="w-8 h-8 md:w-10 md:h-10 text-gray-500 group-hover:text-primary" />
              </div>
            </Link>`;

const replaceAddBtn = `<Link 
              to="/admin/settings" 
              className="group relative bg-[#c6f0e3]/50 border border-black border-dashed rounded-xl p-6 overflow-hidden flex items-center justify-between transition-all duration-300 min-h-[120px] hover:bg-[#c6f0e3]"
            >
              <div className="relative z-10 max-w-[65%]">
                <h2 className="text-2xl md:text-3xl font-pixel text-gray-800 group-hover:text-black mb-2 tracking-wide">Add Category</h2>
                <p className="text-gray-600 font-medium text-xs md:text-sm leading-snug">
                  Configure in Settings
                </p>
              </div>
              <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/50 rounded-full border border-black/20">
                <Plus className="w-8 h-8 md:w-10 md:h-10 text-black/70 group-hover:text-black" />
              </div>
            </Link>`;

file = file.replace(targetAddBtn, replaceAddBtn);

fs.writeFileSync('src/pages/store/Home.tsx', file);
