import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes and returns a Firestore instance based on dynamic runtime config or Vite environment variables.
 * Returns null if no valid configuration is provided.
 */
export function getFirestoreInstance(runtimeConfig = null) {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // Prioritize runtime config (entered via UI) over environment variables
  const finalConfig = runtimeConfig && runtimeConfig.apiKey && runtimeConfig.projectId
    ? runtimeConfig
    : (envConfig.apiKey && envConfig.projectId ? envConfig : null);

  if (!finalConfig) {
    return null;
  }

  try {
    const app = getApps().length === 0 ? initializeApp(finalConfig) : getApp();
    return getFirestore(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    return null;
  }
}
