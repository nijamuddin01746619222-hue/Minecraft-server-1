const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `<Route index element={isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to='/auth' replace />} />`;
const replaceStr = `<Route index element={isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin' ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', file);
