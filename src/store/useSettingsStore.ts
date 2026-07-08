import { create } from 'zustand';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export interface RankFeature {
  id: string;
  name: string;
  type: 'text' | 'boolean' | 'image';
  visible: boolean;
  order: number;
}

export interface SiteSettings {
  websiteName: string;
  serverIp: string;
  discordLink: string;
  youtubeLink?: string;
  facebookLink?: string;
  telegramLink?: string;
  currency: string;
  themePrimary: string;
  themeSecondary: string;
  logoUrl: string;
  headerBannerUrl: string;
  homeRanksImage: string;
  homePebblesImage: string;
  rightSideBanner: string;
  maintenanceMode: boolean;
  rankFeatures?: RankFeature[];
  onlinePlayers: {
    random: boolean;
    count: number;
  };
  imgbbApiKey: string;
  footerText: string;
  paymentMethods: {
    bkash: { enabled: boolean; number: string; type: string };
    nagad: { enabled: boolean; number: string; type: string };
    rocket: { enabled: boolean; number: string; type: string };
    bank: { enabled: boolean; details: string };
    crypto: { enabled: boolean; details: string };
  };
}

const defaultSettings: SiteSettings = {
  websiteName: 'FIEXFALL',
  serverIp: 'play.fiexfall.com',
  discordLink: 'https://discord.gg/fiexfall',
  currency: '৳',
  themePrimary: '#00e5ff',
  themeSecondary: '#0f172a',
  logoUrl: '',
  headerBannerUrl: '',
  homeRanksImage: '',
  homePebblesImage: '',
  rightSideBanner: '',
  maintenanceMode: false,
  onlinePlayers: {
    random: true,
    count: 10
  },
  imgbbApiKey: '2ce0eca99a727bc10ab762ebfeef3d02',
  footerText: '© 2026 Minecraft Store. All rights reserved.',
  paymentMethods: {
    bkash: { enabled: true, number: '01700000000', type: 'Personal' },
    nagad: { enabled: false, number: '', type: 'Personal' },
    rocket: { enabled: false, number: '', type: 'Personal' },
    bank: { enabled: false, details: '' },
    crypto: { enabled: false, details: '' },
  }
};

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  initSettings: () => () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  loading: true,
  initSettings: () => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        set({ settings: { ...defaultSettings, ...docSnap.data() as Partial<SiteSettings> }, loading: false });
      } else {
        set({ loading: false });
      }
    });
    return unsub;
  }
}));
