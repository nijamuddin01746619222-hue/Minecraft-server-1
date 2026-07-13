const fs = require('fs');
let file = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

const targetStr = `            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-pixel text-sm mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}`;

file = file.replace(targetStr, '');
fs.writeFileSync('src/pages/store/ProductDetails.tsx', file);
