const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const targetStr = `        {(isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin') && (
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
        )}`;
        
const replaceStr = `        {(isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin') && (
          <div className="relative group/cat">
            <Link 
              to="/admin/settings" 
              className="group relative bg-gray-50 border-2 border-dashed border-gray-400 rounded-xl p-8 overflow-hidden flex items-center justify-between hover:-translate-y-2 hover:shadow-[0_12px_0_0_#000] hover:border-black hover:bg-gray-100 transition-all duration-300 min-h-[160px]"
            >
              <div className="relative z-10 max-w-[60%]">
                <h2 className="text-2xl md:text-3xl font-pixel text-gray-600 group-hover:text-black mb-2">Add Category</h2>
                <p className="text-gray-500 font-bold text-xs md:text-sm leading-snug">
                  Configure in Settings
                </p>
              </div>
              <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-200 group-hover:bg-primary/20 rounded-full transition-colors">
                <Plus className="w-8 h-8 md:w-10 md:h-10 text-gray-500 group-hover:text-primary" />
              </div>
            </Link>
          </div>
        )}`;

file = file.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/store/Home.tsx', file);
