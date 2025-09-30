import { auth } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signOut = (): Promise<void> => {
  return auth.signOut();
};
