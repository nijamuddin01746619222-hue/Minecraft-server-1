const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

// Top buttons
file = file.replace(
  `className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"`,
  `className="grid grid-cols-2 gap-4 pt-6 max-w-3xl mx-auto"`
);

// Categories grid
file = file.replace(
  `<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">`,
  `<section className="grid grid-cols-2 gap-4">`
);

// Bottom section grid
file = file.replace(
  `<section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">`,
  `<section className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">`
);

// Make the buttons a bit more polished and use retro-border
file = file.replace(/bg-\[#c6f0e3\] border border-black/g, "bg-[#c6f0e3] border-2 border-black");
file = file.replace(/bg-\[#c6f0e3\]\/50 border border-black/g, "bg-[#c6f0e3]/50 border-2 border-black");

fs.writeFileSync('src/pages/store/Home.tsx', file);
