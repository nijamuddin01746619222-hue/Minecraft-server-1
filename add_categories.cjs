const fs = require('fs');
let file = fs.readFileSync('src/store/useSettingsStore.ts', 'utf8');

const targetStr1 = `  paymentMethods: {`;
const replaceStr1 = `  categories?: {
    id: string;
    name: string;
    icon: string;
    link: string;
    enabled: boolean;
  }[];
  paymentMethods: {`;
file = file.replace(targetStr1, replaceStr1);

const targetStr2 = `  paymentMethods: {
    bkash: { enabled: true, number: '01700000000', type: 'Personal' },`;
const replaceStr2 = `  categories: [
    { id: 'ranks', name: 'Ranks', icon: '', link: '/ranks', enabled: true },
    { id: 'pebbles', name: 'Pebbles', icon: '', link: '/coins', enabled: true },
    { id: 'plugins', name: 'Plugins', icon: '', link: '/plugins', enabled: true },
    { id: 'setups', name: 'Server Setups', icon: '', link: '/setups', enabled: true },
    { id: 'textures', name: 'Textures', icon: '', link: '/textures', enabled: true }
  ],
  paymentMethods: {
    bkash: { enabled: true, number: '01700000000', type: 'Personal' },`;
file = file.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/store/useSettingsStore.ts', file);
