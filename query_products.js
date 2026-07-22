import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  projectId: "remixed-project-id" // use user's project info if possible or just use a proxy script?
});
