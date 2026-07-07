import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { ShoppingCart, User as UserIcon, LogOut, Search, Menu, X, MoreVertical, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function StoreLayout() {
  const { user } = useAuthStore();
  const { items } = useCartStore();
  const { settings, loading } = useSettingsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);



  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'RANKS', path: '/ranks' },
    { name: 'COINS', path: '/coins' },
    { name: 'HISTORY', path: '/profile' },
    { name: 'SUPPORT', path: '/support' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden" style={{'--theme-primary': settings.themePrimary} as any}>
      {/* Navbar */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.websiteName} className="h-10 md:h-12 lg:h-14 max-w-[200px] object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rotate-45 bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary"></div>
                  </div>
                  <span className="font-bold text-2xl text-black tracking-widest hidden sm:block">
                    {settings.websiteName}
                  </span>
                </div>
              )}
            </Link>

            {settings.headerBannerUrl && (
              <div className="hidden md:block border-l-2 border-black pl-6">
                <img src={settings.headerBannerUrl} alt="Banner" className="h-12 lg:h-[60px] object-contain" />
              </div>
            )}

            <nav className="hidden md:flex items-center gap-2 lg:ml-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 text-xs font-bold tracking-widest rounded-md transition-colors ${
                      isActive 
                        ? "text-primary border-b-2 border-primary" 
                        : "text-gray-600 hover:text-black"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 relative">
                <Link to="/profile" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors border border-gray-200">
                  <UserIcon className="w-4 h-4 text-gray-800" />
                  <span className="text-sm font-medium text-black hidden sm:block">
                    {user.minecraftUsername || user.email?.split('@')[0]}
                  </span>
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors rounded-md"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white retro-border border border-black rounded-lg shadow-xl py-1 z-50">
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <Link to="/admin/dashboard" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:text-black hover:bg-gray-100 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={async () => {
                          try {
                            await signOut(auth);
                            setIsProfileMenuOpen(false);
                          } catch (e) {
                            console.error("Logout error", e);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/auth" className="px-5 py-2 text-xs font-bold tracking-widest border border-gray-700 text-gray-800 hover:text-black hover:border-gray-500 rounded-md transition-colors">
                  LOGIN
                </Link>
                <Link to="/auth?tab=register" className="px-5 py-2 text-xs font-bold tracking-widest bg-primary hover:bg-primary/90 text-[#0b0f19] rounded-md transition-colors retro-shadow">
                  REGISTER
                </Link>
              </div>
            )}

            <button 
              className="md:hidden p-2 text-gray-600 hover:text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black bg-white retro-border">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-bold tracking-wider rounded-md transition-colors ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-gray-600 hover:text-black hover:bg-white/5"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {!user ? (
                <div className="pt-4 border-t border-black flex flex-col gap-2">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-center text-sm font-bold bg-gray-800 text-black rounded-md text-white">
                    LOGIN
                  </Link>
                  <Link to="/auth?tab=register" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-center text-sm font-bold bg-primary text-black rounded-md">
                    REGISTER
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-black flex flex-col gap-2">
                  <button onClick={async () => {
                    try {
                      await signOut(auth);
                      setIsMobileMenuOpen(false);
                    } catch (e) {
                      console.error("Logout error", e);
                    }
                  }} className="px-4 py-3 text-center text-sm font-bold bg-red-500/20 text-red-500 rounded-md">
                    LOGOUT
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.websiteName} className="h-8 object-contain opacity-80 grayscale" />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-bold text-gray-800">
                    {settings.websiteName.charAt(0)}
                  </div>
                )}
                <span className="font-bold text-xl text-gray-800 tracking-wide">
                  {settings.websiteName}
                </span>
              </div>
              <p className="text-gray-700 text-sm max-w-md">
                We are in no way affiliated with or endorsed by Mojang, AB.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/ranks" className="text-gray-600 hover:text-primary transition-colors">Store</Link></li>
                <li><Link to="/support" className="text-gray-600 hover:text-primary transition-colors">Support</Link></li>
                <li><Link to="/admin" className="text-gray-600 hover:text-primary transition-colors">Admin</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-black mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-black flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 text-sm">{settings.footerText}</p>
            <div className="flex gap-4">
              {settings.discordLink && <a href={settings.discordLink} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-[#5865F2] transition-colors">Discord</a>}
              {settings.youtubeLink && <a href={settings.youtubeLink} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-[#FF0000] transition-colors">YouTube</a>}
              {settings.facebookLink && <a href={settings.facebookLink} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-[#1877F2] transition-colors">Facebook</a>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
