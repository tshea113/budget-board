import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { firebaseAuth } from "@/lib/firebase";

export const AuthContext = createContext({});

const AuthProvider = ({ children }: {children: any}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = (email: string, password: string) => {
    setLoading(true);
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((res: UserCredential) => {
        return res;
      })
      .catch((err: Error) => {
        console.error(err.message)
        return null
      });
  };

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(firebaseAuth, email, password)
      return user
    } catch(err) {
      console.error(err)
      setLoading(false)
      return null
    }
  };

  const logOut = () => {
    setLoading(true);
    return signOut(firebaseAuth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    createUser,
    user,
    loginUser,
    logOut,
    loading
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;