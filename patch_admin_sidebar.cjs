const fs = require('fs');
let file = fs.readFileSync('src/components/layout/AdminLayout.tsx', 'utf8');

const targetStr = `  const navItemsManage = [
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const navItemsSettings = [
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  if (user?.email?.toLowerCase() === 'taher@gmail.com') {
    navItemsSettings.push({ name: 'Admins', path: '/admin/admins', icon: ShieldAlert } as any);
  }`;

const replaceStr = `  const [productsOpen, setProductsOpen] = React.useState(true);

  const mainNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];
  
  const productCategories = [
    { name: 'Ranks', path: '/admin/products?category=ranks' },
    { name: 'Pebbles', path: '/admin/products?category=coins' },
    { name: 'Plugins', path: '/admin/products?category=plugins' },
    { name: 'Server Setups', path: '/admin/products?category=setups' },
    { name: 'Textures', path: '/admin/products?category=textures' },
  ];

  const secondaryNav = [
    { name: 'Categories', path: '/admin/settings', icon: Layers },
    { name: 'Coupons', path: '/admin/settings', icon: Ticket },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Payments', path: '/admin/orders', icon: CreditCard },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'Appearance', path: '/admin/settings', icon: Palette },
    { name: 'Announcements', path: '/admin/settings', icon: Megaphone },
    { name: 'Reports', path: '/admin', icon: BarChart3 },
    { name: 'Logs', path: '/admin', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Sliders },
  ];

  if (user?.email?.toLowerCase() === 'taher@gmail.com') {
    secondaryNav.push({ name: 'Admins', path: '/admin/admins', icon: ShieldAlert });
  }`;

file = file.replace(targetStr, replaceStr);

const targetStr2 = `import { LogOut, Package, Settings, ShieldAlert, ShoppingCart, Users, Zap } from 'lucide-react';`;
const replaceStr2 = `import { LogOut, Package, Settings, ShieldAlert, ShoppingCart, Users, Zap, LayoutDashboard, ChevronDown, ChevronRight, Layers, Ticket, CreditCard, Palette, Megaphone, BarChart3, FileText, Sliders } from 'lucide-react';
import React from 'react';`;
file = file.replace(targetStr2, replaceStr2);

const targetStr3 = `        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-1 mb-8">
            <h4 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Manage</h4>
            {navItemsManage.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={\`flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm transition-colors \${
                    isActive ? 'bg-primary text-black' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }\`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <h4 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Settings</h4>
            {navItemsSettings.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={\`flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm transition-colors \${
                    isActive ? 'bg-primary text-black' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }\`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>`;

const replaceStr3 = `        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-300">
          <div className="space-y-1 mb-2">
            {mainNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={\`flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm transition-colors \${
                    isActive ? 'bg-primary text-black' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }\`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1 mb-2">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={\`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold text-sm transition-colors \${
                location.pathname === '/admin/products' && !productsOpen ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }\`}
            >
              <div className="flex items-center gap-3">
                <Package className={\`w-5 h-5 \${location.pathname === '/admin/products' ? 'text-primary' : ''}\`} />
                <span className={location.pathname === '/admin/products' ? 'text-primary' : ''}>Products</span>
              </div>
              {productsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {productsOpen && (
              <div className="pl-11 pr-2 py-1 space-y-1 bg-gray-50/50 rounded-lg border-l-2 border-primary/20 ml-2">
                {productCategories.map((cat) => {
                  const isActive = location.search.includes(cat.path.split('?')[1]) || (location.pathname === '/admin/products' && location.search === '' && cat.name === 'Ranks');
                  return (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className={\`block px-3 py-2 rounded-md font-bold text-xs transition-colors \${
                        isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-200 hover:text-black'
                      }\`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.path && item.name !== 'Reports' && item.name !== 'Logs' && item.name !== 'Categories' && item.name !== 'Coupons' && item.name !== 'Payments' && item.name !== 'Website Settings' && item.name !== 'Appearance' && item.name !== 'Announcements' && item.name !== 'Settings'; // basic logic to highlight real pages
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={\`flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm transition-colors \${
                    isActive ? 'bg-primary text-black' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }\`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>`;

file = file.replace(targetStr3, replaceStr3);
fs.writeFileSync('src/components/layout/AdminLayout.tsx', file);
