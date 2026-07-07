import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "gen-lang-client-0427510382",
  appId: "1:779056649135:web:e13bd15a27c1c6f007955a",
  apiKey: "AIzaSyBlw5yaj5fDoRRUx4NFEFlo_2B--xPeM2E",
  authDomain: "gen-lang-client-0427510382.firebaseapp.com",
  storageBucket: "gen-lang-client-0427510382.firebasestorage.app",
  messagingSenderId: "779056649135"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-9fa2c17f-1d66-4403-a59f-25100d1de185");
export const storage = getStorage(app);
