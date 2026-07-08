const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `                          <input \n                            type="text"\n                            value={formData.rankData[field.id] || ''}\n                            onChange={e => handleRankDataChange(field.id, e.target.value)}\n                            className="w-full bg-white border-2 border-black rounded p-2 text-sm font-bold"\n                            placeholder={field.placeholder}\n                          />`;

const replaceStr = `                          field.id === 'namePrefixImage' ? (
                            <ImageUpload 
                              value={formData.rankData[field.id] || ''} 
                              onChange={url => handleRankDataChange(field.id, url)} 
                              placeholder={field.placeholder} 
                            />
                          ) : (
                            <input 
                              type="text"
                              value={formData.rankData[field.id] || ''}
                              onChange={e => handleRankDataChange(field.id, e.target.value)}
                              className="w-full bg-white border-2 border-black rounded p-2 text-sm font-bold"
                              placeholder={field.placeholder}
                            />
                          )`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/admin/Products.tsx', file);
