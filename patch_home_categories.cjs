const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetStr = `{(settings.categories?.length > 0 ? settings.categories : [`;
const replaceStr = `{(settings.categories && settings.categories.length > 0 ? settings.categories : [`;

file = file.replace(targetStr, replaceStr);

const targetStr2 = `      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {(settings.categories && settings.categories.length > 0 ? settings.categories : [
          { id: 'ranks', name: 'Ranks', icon: settings.homeRanksImage || '', link: '/ranks', enabled: true },
          { id: 'pebbles', name: 'Pebbles', icon: settings.homePebblesImage || '', link: '/coins', enabled: true },
          { id: 'plugins', name: 'Plugins', icon: '', link: '/plugins', enabled: true },
          { id: 'setups', name: 'Server Setups', icon: '', link: '/setups', enabled: true },
          { id: 'textures', name: 'Textures', icon: '', link: '/textures', enabled: true }
        ]).filter(c => c.enabled).map(cat => {
          let defaultDesc = "";
          if (cat.id === 'ranks') defaultDesc = "Unlock exclusive perks, commands & cosmetics";
          if (cat.id === 'pebbles') defaultDesc = "In-game currency for the FIEXFALL store";
          if (cat.id === 'plugins') defaultDesc = "Powerful plugins to enhance your server";
          if (cat.id === 'setups') defaultDesc = "Professional server setups ready to use";
          if (cat.id === 'textures') defaultDesc = "High quality textures for better experience";

          return (
            <Link 
              key={cat.id}
              to={cat.link} 
              className="group relative bg-white retro-border border-black rounded-xl p-6 overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_8px_0_0_#000] transition-all duration-300"
            >
              <div className="mb-4">
                <h2 className="text-xl font-pixel text-black mb-2">{cat.name}</h2>
                <p className="text-gray-600 font-bold text-xs leading-snug">
                  {defaultDesc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-4 mt-auto">
                <div className="w-20 h-20 flex items-center justify-center">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Zap className="w-12 h-12 text-primary opacity-50 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <button className="w-full bg-slate-800 text-white font-bold py-2 rounded border-2 border-black text-sm hover:bg-slate-700">
                  View {cat.name}
                </button>
              </div>
            </Link>
          );
        })}
      </section>`;
const replaceStr2 = `      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link 
          to="/ranks" 
          className="group relative bg-primary/20 retro-border border-black rounded-xl p-8 overflow-hidden flex items-center justify-between hover:-translate-y-2 hover:shadow-[0_12px_0_0_#000] hover:bg-primary/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 max-w-[60%]">
            <h2 className="text-3xl font-pixel text-black mb-3">Ranks</h2>
            <p className="text-gray-800 font-bold leading-snug">
              Unlock exclusive perks, commands & cosmetics
            </p>
          </div>
          <div className="relative z-10">
            {settings.homeRanksImage ? (
              <img src={settings.homeRanksImage} alt="Ranks" className="w-24 h-24 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            ) : (
              <Zap className="w-20 h-20 text-primary opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            )}
          </div>
        </Link>

        <Link 
          to="/coins" 
          className="group relative bg-primary/20 retro-border border-black rounded-xl p-8 overflow-hidden flex items-center justify-between hover:-translate-y-2 hover:shadow-[0_12px_0_0_#000] hover:bg-primary/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 max-w-[60%]">
            <h2 className="text-3xl font-pixel text-black mb-3">Pebbles</h2>
            <p className="text-gray-800 font-bold leading-snug">
              In-game currency for the FIEXFALL store
            </p>
          </div>
          <div className="relative z-10">
            {settings.homePebblesImage ? (
              <img src={settings.homePebblesImage} alt="Pebbles" className="w-24 h-24 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            ) : (
              <img src="/pebbles.png" alt="Pebbles" className="w-20 h-20 object-contain opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" onError={(e) => { e.currentTarget.style.display='none' }} />
            )}
          </div>
        </Link>
      </section>`;

file = file.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/pages/store/Home.tsx', file);
