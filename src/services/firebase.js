import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

let app;
let db;
let authInstance = null;

// Check if config has been customized
const isDefault = firebaseConfig.apiKey === "YOUR_API_KEY" || !firebaseConfig.apiKey;

if (!isDefault) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase Initialized successfully with project ID:", firebaseConfig.projectId);
  } catch (err) {
    console.error("❌ Firebase Initialization Error:", err);
  }
} else {
  console.warn("⚠️ Firebase is using default placeholder configuration. Falling back to LocalStorage.");
}

// Lazy getter for Firebase Auth: Prevents auth iframe (93 KiB) and auth bundle from loading on public pages
export const getAuthInstance = async () => {
  if (authInstance) return authInstance;
  if (!isDefault && app) {
    try {
      const { getAuth } = await import("firebase/auth");
      authInstance = getAuth(app);
    } catch (e) {
      console.error("❌ Failed to load Firebase Auth:", e);
    }
  }
  return authInstance;
};

// Backwards-compatible auth export (will be null on initial boot unless getAuthInstance is awaited)
export const auth = null;

export { app, db, isDefault };
