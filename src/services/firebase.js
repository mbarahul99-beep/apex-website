import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

let app;
let db;
let auth;

// Check if config has been customized
const isDefault = firebaseConfig.apiKey === "YOUR_API_KEY" || !firebaseConfig.apiKey;

if (!isDefault) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 Firebase Initialized successfully with project ID:", firebaseConfig.projectId);
  } catch (err) {
    console.error("❌ Firebase Initialization Error:", err);
  }
} else {
  console.warn("⚠️ Firebase is using default placeholder configuration. Falling back to LocalStorage.");
}

export { app, db, auth, isDefault };
