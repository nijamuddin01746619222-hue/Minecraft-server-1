const fs = require('fs');
let file = fs.readFileSync('src/store/useCartStore.ts', 'utf8');

const newAddItem = `      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),`;

file = file.replace(/      addItem: \(item\) => set\(\(state\) => \{[\s\S]*?\}\),/, newAddItem);

fs.writeFileSync('src/store/useCartStore.ts', file);
