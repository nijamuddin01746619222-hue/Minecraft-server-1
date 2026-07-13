const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Profile.tsx', 'utf8');

const targetStr = `  const [loading, setLoading] = useState(true);`;
const replaceStr = `  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plugins');`;
file = file.replace(targetStr, replaceStr);

const targetStr2 = `        <h2 className="text-2xl font-bold font-pixel mb-6">My History</h2>
        
        {loading ? (`;
const replaceStr2 = `        <h2 className="text-2xl font-bold font-pixel mb-6">My History</h2>
        
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
          {settings.categories?.filter(c => c.enabled).map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={\`px-4 py-2 text-sm font-bold rounded-lg transition-colors \${activeTab === cat.id ? 'bg-primary text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}\`}
            >
              {cat.name}
            </button>
          )) || ['ranks', 'pebbles', 'plugins', 'setups', 'textures'].map(id => (
            <button 
              key={id} 
              onClick={() => setActiveTab(id)}
              className={\`px-4 py-2 text-sm font-bold rounded-lg transition-colors \${activeTab === id ? 'bg-primary text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}\`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (`;
file = file.replace(targetStr2, replaceStr2);

const targetStr3 = `              <tbody className="text-sm">
                {orders.flatMap(order => 
                  order.items.map((item: any, idx: number) => {`;
const replaceStr3 = `              <tbody className="text-sm">
                {orders.flatMap(order => 
                  order.items
                    .filter((item: any) => (item.category || 'ranks') === activeTab || (activeTab === 'pebbles' && item.category === 'coins'))
                    .map((item: any, idx: number) => {`;
file = file.replace(targetStr3, replaceStr3);

fs.writeFileSync('src/pages/store/Profile.tsx', file);
