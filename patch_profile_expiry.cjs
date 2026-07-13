const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Profile.tsx', 'utf8');

let targetStr = `<th className="pb-3 px-4 font-normal">Expire In</th>`;
file = file.replace(targetStr, '');

targetStr = `                    let expiryText = '-';
                    let isExpired = false;
                    
                    if (item.linkExpiry && item.linkExpiry !== 'Lifetime') {
                      let expiryTime = createdAt.getTime();
                      if (item.linkExpiry === '24 Hours') expiryTime += 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '48 Hours') expiryTime += 48 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '3 Days') expiryTime += 3 * 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '7 Days') expiryTime += 7 * 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '14 Days') expiryTime += 14 * 24 * 60 * 60 * 1000;
                      else if (item.linkExpiry === '30 Days') expiryTime += 30 * 24 * 60 * 60 * 1000;
                      
                      const now = new Date().getTime();
                      if (now > expiryTime) {
                        expiryText = 'Expired';
                        isExpired = true;
                      } else {
                        const diff = expiryTime - now;
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        expiryText = days > 0 ? \`\${days} Days\` : \`\${hours} Hours\`;
                      }
                    } else if (item.linkExpiry === 'Lifetime') {
                      expiryText = 'Lifetime';
                    }`;
file = file.replace(targetStr, '');

targetStr = `<td className="py-4 px-4">{expiryText}</td>`;
file = file.replace(targetStr, '');

targetStr = `{isApproved && item.productLink && !isExpired ? (`
let replaceStr = `{isApproved && item.productLink ? (`
file = file.replace(targetStr, replaceStr);

targetStr = `<div className="mt-4 text-xs text-gray-500">
          Note: Links will be expired automatically after the time limit.
        </div>`;
file = file.replace(targetStr, '');

fs.writeFileSync('src/pages/store/Profile.tsx', file);
