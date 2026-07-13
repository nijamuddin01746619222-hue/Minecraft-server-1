const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

// I will just use regex to fix this syntax error.
// Find the exact broken piece and replace it.

const brokenStr = `              </div>
            </div>
            
              <button type="button" onClick={() => {
                const newCats = [...(formData.categories || [])];
                newCats.splice(idx, 1);
                setFormData({...formData, categories: newCats});
              }} className="mt-4 px-4 py-2 bg-red-100 text-red-600 border-2 border-red-600 rounded font-bold text-xs hover:bg-red-200 transition-colors">
                Remove Button
              </button>
            </div>
          ))}
          <button`;

const fixStr = `              </div>
              <button type="button" onClick={() => {
                const newCats = [...(formData.categories || [])];
                newCats.splice(idx, 1);
                setFormData({...formData, categories: newCats});
              }} className="mt-4 px-4 py-2 bg-red-100 text-red-600 border-2 border-red-600 rounded font-bold text-xs hover:bg-red-200 transition-colors self-start">
                Remove Button
              </button>
            </div>
          ))}
          <button`;
          
if (file.includes(brokenStr)) {
  file = file.replace(brokenStr, fixStr);
} else {
  // Let's just do it dynamically
  const s1 = `              </div>\n            </div>\n            \n              <button`;
  const r1 = `              </div>\n              <button`;
  file = file.replace(s1, r1);
}

fs.writeFileSync('src/pages/admin/Settings.tsx', file);
