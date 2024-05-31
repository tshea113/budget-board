import { initializeApp } from 'firebase/app';
import {
  type UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

export const getToken = async (): Promise<string | undefined> =>
  await firebaseAuth.currentUser?.getIdToken();

export const createUser = async (email: string, password: string): Promise<string> => {
  let errorCode: string = '';
  try {
    await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
      async (user: UserCredential) => {
        if (user != null) {
          await sendEmailVerification(user.user);
        }
      }
    );
  } catch (err: any) {
    errorCode = err.code;
  }
  return errorCode;
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  let errorCode: string = '';
  try {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (err: any) {
    errorCode = err.code;
  }
  return errorCode;
};

export const sendVerificationEmail = async (): Promise<string> => {
  let errorCode: string = '';
  try {
    if (firebaseAuth.currentUser != null) {
      if (!firebaseAuth.currentUser.emailVerified) {
        await sendEmailVerification(firebaseAuth.currentUser);
      }
    }
  } catch (err: any) {
    errorCode = err.code;
  }
  return errorCode;
};

export const logOut = async (): Promise<void> => {
  await signOut(firebaseAuth);
};

export const getMessageForErrorCode = (errorCode: string): string => {
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
