const fs = require('fs');
let file = fs.readFileSync('src/components/layout/StoreLayout.tsx', 'utf8');

const mobileCart = `
              <NavLink
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  \`px-4 py-3 text-sm font-bold tracking-wider rounded-md transition-colors flex items-center justify-between \${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-gray-600 hover:text-black hover:bg-white/5"
                  }\`
                }
              >
                <span>CART</span>
                {items.length > 0 && (
                  <span className="bg-primary text-black text-xs px-2 py-0.5 rounded-full">
                    {items.reduce((acc, item) => acc + item.quantity, 0)} items
                  </span>
                )}
              </NavLink>
`;

if (!file.includes('<span>CART</span>')) {
  file = file.replace(
    '{!user ? (',
    mobileCart + '              {!user ? ('
  );
  fs.writeFileSync('src/components/layout/StoreLayout.tsx', file);
}
