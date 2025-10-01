import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, type User } from "firebase/auth";
import { addDocument, getDocuments } from "./firestore";

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const email = user.email || "";
  const displayName = user.displayName || "";
  const uid = user.uid;
  if (email) {
    const existing = await getDocuments("company/A5eWer5YT4GtsAClx90o/users", {
      where: [["email", "==", email]],
      limit: 1,
    });
    if (existing.length === 0) {
      await addDocument("company/A5eWer5YT4GtsAClx90o/users", {
        uid,
        email,
        name: displayName,
        createdAt: Date.now(),
      });
    }
  }
  return user;
};

export const signOut = (): Promise<void> => {
  return auth.signOut();
};
