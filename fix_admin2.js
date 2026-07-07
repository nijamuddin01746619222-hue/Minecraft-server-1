import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import fs from "fs";

const configStr = fs.readFileSync("firebase-applet-config.json", "utf8");
const config = JSON.parse(configStr);

// Use the explicit database ID
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  console.log("Finding user with email taher@gmail.com...");
  const q = query(collection(db, "users"), where("email", "==", "taher@gmail.com"));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log("No user found with that email.");
  } else {
    for (const document of querySnapshot.docs) {
      console.log("Found user, updating role...", document.id);
      await updateDoc(doc(db, "users", document.id), {
        role: "admin"
      });
      console.log("Done.");
    }
  }
}

run().catch(console.error).finally(() => process.exit());
