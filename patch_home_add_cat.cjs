const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetStr = `        })}
      </section>`;

const replaceStr = `        })}
        {(isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin') && (
          <div className="relative group">
            <Link 
              to="/admin/settings" 
              className="block h-full bg-gray-50 border-2 border-dashed border-gray-400 rounded-xl p-6 overflow-hidden flex flex-col justify-center items-center hover:-translate-y-2 hover:shadow-[0_8px_0_0_#000] hover:border-black transition-all duration-300 min-h-[250px]"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-8 h-8 text-gray-500 group-hover:text-primary" />
              </div>
              <h2 className="text-xl font-pixel text-gray-600 mb-2 group-hover:text-black">Add Category</h2>
              <p className="text-gray-500 font-bold text-xs text-center">
                Configure in Settings
              </p>
            </Link>
          </div>
        )}
      </section>`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/store/Home.tsx', file);
