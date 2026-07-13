const fs = require('fs');
let file = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const regexCopy = /<button\s+onClick=\{handleCopyIp\}\s+className="w-full sm:w-auto bg-white retro-border border-black rounded-xl px-8 py-4 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-\[0_8px_0_0_#000\] transition-all group">/g;
const replaceCopy = `<button 
             onClick={handleCopyIp}
            className="w-full bg-white border border-black rounded-xl px-2 py-3 flex flex-col items-center justify-center transition-all group"
          >`;
file = file.replace(regexCopy, replaceCopy);

const regexDiscord = /<a\s+href=\{settings.discordLink\}\s+target="_blank"\s+rel="noreferrer"\s+className="w-full sm:w-auto bg-primary retro-border border-black rounded-xl px-8 py-4 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-\[0_8px_0_0_#000\] transition-all group">/g;
const replaceDiscord = `<a 
              href={settings.discordLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-primary border border-black rounded-xl px-2 py-3 flex flex-col items-center justify-center transition-all group"
            >`;
file = file.replace(regexDiscord, replaceDiscord);

// Also let's fix the text inside those buttons
file = file.replace(
  `<div className="flex items-center gap-3 mb-1">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-black font-black text-lg">{players} Players Online</span>
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">{settings.serverIp} - Click to copy</span>`,
  `<div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse"></span>
              <span className="text-black font-black text-xs sm:text-sm">{players} Players Online</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 group-hover:text-black transition-colors">{settings.serverIp} - Click to copy</span>`
);

file = file.replace(
  `<div className="flex items-center gap-3 mb-1">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-black font-black text-lg">6,133 Total Members</span>
              </div>
              <span className="text-sm font-bold text-gray-800 group-hover:text-black transition-colors">Click to Join Discord</span>`,
  `<div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005c66] animate-pulse"></span>
                <span className="text-black font-black text-xs sm:text-sm">6,133 Total Members</span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-800 group-hover:text-black transition-colors">Click to Join Discord</span>`
);

fs.writeFileSync('src/pages/store/Home.tsx', file);
