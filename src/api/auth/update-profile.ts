import { firestore } from "@/lib/firebaseConfig";
import { Auth } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const updateUserProfile = async (
  authInstance: Auth,
  updates: {
    email?: string;
    name?: string;
    level?: string;
    photoURL?: string;
    faculty?: string;
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
      ...(updates.level && { level: updates.level }),
      ...(updates.faculty && { faculty: updates.faculty }),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// export const uploadProfileImage = async (file: File, userId: string) => {
//   const storage = getStorage(app);
//   const fileRef = ref(storage, `profilePictures/${userId}/${file.name}`);

//   // Upload file
//   await uploadBytes(fileRef, file);

//   // Get download URL
//   const downloadURL = await getDownloadURL(fileRef);

//   // Save URL to Firestore or Realtime Database
//   return downloadURL;
// };
