import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Prevent initialization crash when keys are missing during Vercel build prerendering
const hasApiKey = firebaseConfig.apiKey && firebaseConfig.apiKey !== "";
const activeConfig = hasApiKey ? firebaseConfig : {
  ...firebaseConfig,
  apiKey: "AIzaSyFakeKeyForPrerenderBuildTime",
  authDomain: "mock-domain.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef"
};

// Prevent re-initialization on hot reloads (Next.js dev mode)
const app = getApps().length === 0 ? initializeApp(activeConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for profile info
googleProvider.addScope("profile");
googleProvider.addScope("email");

/**
 * Sign in with Google popup.
 * Returns the Firebase User object on success.
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign out the current Firebase user.
 */
export async function firebaseSignOut() {
  await signOut(auth);
}

export default app;
