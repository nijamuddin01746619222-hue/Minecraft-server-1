const fs = require('fs');
let file = fs.readFileSync('src/components/layout/AdminLayout.tsx', 'utf8');

const targetStr = `  const [productsOpen, setProductsOpen] = React.useState(true);

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

file = file.replace(targetStr, '');
fs.writeFileSync('src/components/layout/AdminLayout.tsx', file);
