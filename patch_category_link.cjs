const fs = require('fs');
let file = fs.readFileSync('src/pages/store/CategoryPage.tsx', 'utf8');

const targetStr = `              <div className="p-6 bg-gray-50 border-b-2 border-black text-center relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                {product.image && (
                  <img src={product.image} alt={product.name} className="h-32 object-contain mx-auto group-hover:scale-110 transition-transform duration-300" />
                )}
                <h2 className="text-2xl font-bold font-pixel text-black mt-4">{product.name}</h2>
                <div className="mt-2 flex items-center justify-center gap-2">
                  {product.salePrice > 0 ? (
                    <>
                      <span className="text-sm text-gray-400 line-through font-bold">{formatPrice(product.price, settings.currency)}</span>
                      <span className="text-xl text-primary font-black">{formatPrice(product.salePrice, settings.currency)}</span>
                    </>
                  ) : (
                    <span className="text-xl text-black font-black">{formatPrice(product.price, settings.currency)}</span>
                  )}
                </div>`;

const replaceStr = `              <div className="p-6 bg-gray-50 border-b-2 border-black text-center relative overflow-hidden group-hover:bg-primary/10 transition-colors flex flex-col items-center">
                <Link to={\`/product/\${product.id}\`} className="block w-full">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="h-32 object-contain mx-auto group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <h2 className="text-2xl font-bold font-pixel text-black mt-4 group-hover:text-primary transition-colors">{product.name}</h2>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {product.salePrice > 0 ? (
                      <>
                        <span className="text-sm text-gray-400 line-through font-bold">{formatPrice(product.price, settings.currency)}</span>
                        <span className="text-xl text-primary font-black">{formatPrice(product.salePrice, settings.currency)}</span>
                      </>
                    ) : (
                      <span className="text-xl text-black font-black">{formatPrice(product.price, settings.currency)}</span>
                    )}
                  </div>
                </Link>`;
file = file.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/store/CategoryPage.tsx', file);
