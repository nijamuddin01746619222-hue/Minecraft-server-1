import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0427510382",
  appId: "1:779056649135:web:e13bd15a27c1c6f007955a",
  apiKey: "AIzaSyBlw5yaj5fDoRRUx4NFEFlo_2B--xPeM2E",
  authDomain: "gen-lang-client-0427510382.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-9fa2c17f-1d66-4403-a59f-25100d1de185");

getDocs(collection(db, 'products')).then(snap => {
  console.log('Products count:', snap.size);
  snap.forEach(doc => {
    console.log(doc.id, doc.data().category, doc.data().enabled);
  });
}).catch(console.error);
