import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Users, Award, Zap, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const mockDonators = [
  { id: 'm1', minecraftUsername: 'Notch' },
  { id: 'm2', minecraftUsername: 'Dream' },
  { id: 'm3', minecraftUsername: 'Technoblade' },
  { id: 'm4', minecraftUsername: 'TommyInnit' },
  { id: 'm5', minecraftUsername: 'Philza' },
];

export default function Home() {
  const { settings } = useSettingsStore();
  const [players, setPlayers] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        // Filter out those without minecraftUsername
        const validOrders = fetched.filter(o => o.minecraftUsername);
        
        // If we don't have enough real orders, pad with mock ones for display purposes
        if (validOrders.length < 5) {
          const needed = 5 - validOrders.length;
          setRecentOrders([...validOrders, ...mockDonators.slice(0, needed)]);
        } else {
          setRecentOrders(validOrders);
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        setRecentOrders(mockDonators);
      }
    };
    fetchRecentOrders();
  }, []);

  useEffect(() => {
    if (settings.onlinePlayers?.random) {
      // Create a deterministic pseudo-random number based on the current hour (between 13 and 102)
      const currentHour = new Date().getHours();
      // Simple hash of currentHour
      const hash = (currentHour * 2654435761) % Math.pow(2, 32);
      const randomInRange = 13 + (hash % (102 - 13 + 1));
      setPlayers(randomInRange);
    } else {
      setPlayers(settings.onlinePlayers?.count || 0);
    }
  }, [settings.onlinePlayers]);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(settings.serverIp);
    toast.success('IP Copied to clipboard!', {
      style: { background: '#00e5ff', color: '#000', border: '2px solid #000' }
    });
  };

  return (
    <div className="w-full space-y-16 pb-20 pt-8 px-2 md:px-4 overflow-hidden">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-black font-pixel uppercase tracking-widest leading-tight">
          Welcome to <span className="block">{settings.websiteName} Store</span>
        </h1>
        <div className="space-y-2">
          <p className="text-gray-800 font-bold text-lg max-w-2xl mx-auto">
            Upgrade your gameplay with exclusive ranks and pebble packs.
          </p>
          <p className="text-gray-600 font-bold text-sm max-w-2xl mx-auto">
            Unlock premium perks and dominate the server.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button 
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
          )}
        </div>
      </section>

      {/* Main Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Top & Recent Donators */}
        <div className={`bg-white retro-border border-black rounded-xl p-6 ${settings.rightSideBanner ? '' : 'md:col-span-2'}`}>
          <h3 className="text-2xl font-pixel text-black mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Top / Recent Donators
          </h3>
          
          <div className="flex flex-wrap gap-6 justify-center">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div 
                  key={order.id} 
                  className="group relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                >
                  <div 
                    className="relative animate-float"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <img 
                      src={`https://minotar.net/helm/${order.minecraftUsername}/64.png`} 
                      alt={order.minecraftUsername} 
                      className="w-20 h-20 rounded border-2 border-black bg-gray-200 group-hover:-translate-y-2 group-hover:shadow-[0_8px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer" 
                    />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 flex flex-col items-center">
                    <div className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap retro-border border-white/20">
                      {order.minecraftUsername}
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-bold italic w-full text-center">No recent purchases yet.</p>
            )}
          </div>
        </div>

        {/* Right Side Banner */}
        {settings.rightSideBanner && (
          <div className="w-full max-w-sm ml-auto">
            <img src={settings.rightSideBanner} alt="Banner" className="w-full h-auto rounded-xl retro-border border-black" />
          </div>
        )}
      </section>

    </div>
  );
}
