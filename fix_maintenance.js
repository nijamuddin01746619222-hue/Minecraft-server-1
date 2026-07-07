import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./firebase-adminsdk.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fix() {
  await db.collection('settings').doc('global').update({
    maintenanceMode: false
  });
  console.log('Maintenance mode disabled!');
}

fix().catch(console.error);
