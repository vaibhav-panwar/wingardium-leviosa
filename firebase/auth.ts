import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, type User } from "firebase/auth";
import { addDocument, getDocuments } from "./firestore";

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Ensure a user doc exists in Firestore (collection: "users")
  const email = user.email || "";
  const displayName = user.displayName || "";
  if (email) {
    const existing = await getDocuments("users", {
      where: [["email", "==", email]],
      limit: 1,
    });
    if (existing.length === 0) {
      await addDocument("users", {
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
