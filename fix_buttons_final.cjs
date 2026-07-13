const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

// Top buttons adjustments
const topBtnTarget = `          <button 
             onClick={handleCopyIp}
            className="w-full sm:w-auto bg-white retro-border border-black rounded-xl px-8 py-4 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-[0_8px_0_0_#000] transition-all group"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-black font-black text-lg">{players} Players Online</span>
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">{settings.serverIp} - Click to copy</span>
          </button>
          {settings.discordLink && (
            <a 
              href={settings.discordLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-primary retro-border border-black rounded-xl px-8 py-4 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-[0_8px_0_0_#000] transition-all group"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-black font-black text-lg">6,133 Total Members</span>
              </div>
              <span className="text-sm font-bold text-gray-800 group-hover:text-black transition-colors">Click to Join Discord</span>
            </a>
          )}`;

const topBtnReplace = `          <button 
             onClick={handleCopyIp}
            className="w-full bg-white border border-black rounded-xl px-2 py-3 flex flex-col items-center justify-center transition-all group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse"></span>
              <span className="text-black font-black text-xs sm:text-sm">{players} Players Online</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 group-hover:text-black transition-colors">{settings.serverIp} - Click to copy</span>
          </button>
          {settings.discordLink && (
            <a 
              href={settings.discordLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-primary border border-black rounded-xl px-2 py-3 flex flex-col items-center justify-center transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005c66] animate-pulse"></span>
                <span className="text-black font-black text-xs sm:text-sm">6,133 Total Members</span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-800 group-hover:text-black transition-colors">Click to Join Discord</span>
            </a>
          )}`;
file = file.replace(topBtnTarget, topBtnReplace);

// Category buttons adjustments
const catTarget = `<Link 
                to={cat.link} 
                className="group relative bg-[#c6f0e3] border-2 border-black rounded-xl p-6 overflow-hidden flex items-center justify-between transition-all duration-300 min-h-[120px]"
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

const catReplace = `<Link 
                to={cat.link} 
                className="group relative bg-[#c6f0e3] border border-black rounded-xl p-4 overflow-hidden flex flex-row items-center justify-between transition-all duration-300"
              >
                <div className="relative z-10 flex-1 pr-2">
                  <h2 className="text-lg sm:text-xl font-pixel text-black mb-1.5 tracking-wide">{cat.name}</h2>
                  <p className="text-black/70 font-medium text-[10px] sm:text-xs leading-tight">
                    {defaultDesc}
                  </p>
                </div>
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-end">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain pixelated" style={{ imageRendering: 'pixelated' }} />
                  ) : (
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-black opacity-50" />
                  )}
                </div>
              </Link>`;
file = file.replace(catTarget, catReplace);

// Add Category button adjustment
const addTarget = `<Link 
              to="/admin/settings" 
              className="group relative bg-[#c6f0e3]/50 border-2 border-black border-dashed rounded-xl p-6 overflow-hidden flex items-center justify-between transition-all duration-300 min-h-[120px] hover:bg-[#c6f0e3]"
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

const addReplace = `<Link 
              to="/admin/settings" 
              className="group relative bg-[#c6f0e3]/50 border border-black border-dashed rounded-xl p-4 overflow-hidden flex flex-row items-center justify-between transition-all duration-300 hover:bg-[#c6f0e3]"
            >
              <div className="relative z-10 flex-1 pr-2">
                <h2 className="text-lg sm:text-xl font-pixel text-gray-800 group-hover:text-black mb-1.5 tracking-wide">Add Category</h2>
                <p className="text-gray-600 font-medium text-[10px] sm:text-xs leading-tight">
                  Configure in Settings
                </p>
              </div>
              <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-end bg-white/50 rounded-full border border-black/20">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-black/70 group-hover:text-black" />
              </div>
            </Link>`;
file = file.replace(addTarget, addReplace);

// Wait, the "Top / Recent Donators" card doesn't have a shadow in the image either, but the "Diamond" image DOES NOT have a card!
// Let's remove the card shadow from top donators and fix diamonds
file = file.replace(`bg-white retro-border border-black rounded-xl p-6`, `bg-white border border-black rounded-xl p-6`);
file = file.replace(`w-full h-auto rounded-xl retro-border border-black`, `w-full h-auto rounded-xl border border-black`);

fs.writeFileSync('src/pages/store/Home.tsx', file);
