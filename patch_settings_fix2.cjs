const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');

const s1 = `              </div>
            </div>
            
            <button type="button" onClick={() => {`;
            
const s2 = `              </div>
            </div>
                        <button type="button" onClick={() => {`;
                        
const r1 = `              </div>
              <button type="button" onClick={() => {`;

if (file.includes(s1)) {
  file = file.replace(s1, r1);
} else if (file.includes(s2)) {
  file = file.replace(s2, r1);
} else {
  // Let's use regex
  file = file.replace(/<\/div>\s*<\/div>\s*<button type="button"/, '</div><button type="button"');
}

fs.writeFileSync('src/pages/admin/Settings.tsx', file);
