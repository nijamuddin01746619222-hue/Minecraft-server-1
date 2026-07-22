const fs = require('fs');
let file = fs.readFileSync('src/components/layout/StoreLayout.tsx', 'utf8');

const cartIcon = `
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-black">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
`;

if (!file.includes('to="/cart" className="relative p-2')) {
  file = file.replace(
    '<div className="flex items-center gap-4">',
    '<div className="flex items-center gap-4">' + cartIcon
  );
  fs.writeFileSync('src/components/layout/StoreLayout.tsx', file);
}
