import { firestore } from "@/lib/firebaseConfig";
import { Auth } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export const updateUserProfile = async (
  authInstance: Auth,
  updates: {
    email?: string;
    name?: string;
  }
) => {
  try {
    // Get the current user
    const currentUser = authInstance.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }
    // Update Firestore user document
    const userDocRef = doc(firestore, "users", currentUser.uid);
    await updateDoc(userDocRef, {
      ...(updates.name && { name: updates.name }),
      ...(updates.email && { email: updates.email }),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
