import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Ticket,
  LogOut,
  Store,
  CreditCard,
  Palette,
  Megaphone,
  Globe, ShieldAlert,
  ChevronDown, ChevronRight, Layers, BarChart3, FileText, Sliders
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminLayout() {
  const { user, setAdminLoggedIn } = useAuthStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('adminSession');
    setAdminLoggedIn(false);
    navigate('/admin');
  };

  const navItemsManage = [
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const navItemsSettings = [
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  if (user?.email?.toLowerCase() === 'taher@gmail.com') {
    navItemsSettings.push({ name: 'Admins', path: '/admin/admins', icon: ShieldAlert } as any);
  }



  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white retro-border border-r border-black flex flex-col">
        <div className="p-6 flex items-center gap-3 mb-4">
          <Link to="/" className="flex items-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.websiteName} className="h-10 max-w-[180px] object-contain" />
            ) : (
              <>
                <div className="w-6 h-6 rotate-45 bg-primary/20 border border-primary flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary"></div>
                </div>
                <span className="font-bold text-lg text-black tracking-widest uppercase truncate">
                  {settings.websiteName}
                </span>
              </>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-6 custom-scrollbar">
          <div>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-2",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-gray-600 hover:text-black hover:bg-gray-800/50"
                )
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>
          </div>

          <div>
            <div className="px-4 text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Manage</div>
            <div className="space-y-1">
              {navItemsManage.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-gray-600 hover:text-black hover:bg-gray-800/50"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <div className="px-4 text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Settings</div>
            <div className="space-y-1">
              {navItemsSettings.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-gray-600 hover:text-black hover:bg-gray-800/50"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-black space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-black bg-white retro-border/50 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Can add breadcrumbs or title here later */}
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg"
            >
              <Store className="w-4 h-4" />
              View Site
            </a>
            
            <div className="flex items-center gap-3 pl-6 border-l border-black">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-black">{useAuthStore.getState().user?.minecraftUsername || 'Admin'}</div>
                <div className="text-xs text-primary">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
                {(useAuthStore.getState().user?.minecraftUsername || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
