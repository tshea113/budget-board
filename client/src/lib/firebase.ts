import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

async function getToken(): Promise<string | undefined> {
  return await firebaseAuth.currentUser?.getIdToken();
}

const getMessageForErrorCode = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'This email or password is not valid.';
    case 'auth/user-disabled':
      return 'This user has been disabled.';
    case 'auth/user-not-found':
      return 'User not found.';
    case 'auth/too-many-requests':
      return ' Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
    case 'auth/missing-email':
      return 'Email not provided.';
    case 'auth/invalid-email':
      return 'Invalid email provided.';
    default:
      return 'An unknown error occurred.';
  }
};

export { firebaseApp, firebaseAuth, getToken, getMessageForErrorCode };
