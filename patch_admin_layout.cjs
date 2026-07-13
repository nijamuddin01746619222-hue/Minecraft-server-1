const fs = require('fs');
let file = fs.readFileSync('src/components/layout/AdminLayout.tsx', 'utf8');

const targetStr = `  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Shield, label: 'Admins', path: '/admin/admins' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];`;

const replaceStr = `  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Package, label: 'Categories', path: '/admin/settings' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Shield, label: 'Admins', path: '/admin/admins' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/layout/AdminLayout.tsx', file);
