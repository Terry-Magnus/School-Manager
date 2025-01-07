import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

const userLogin = async (identifier: string, password: string) => {
  const auth = getAuth();

  try {
    let email = identifier;

    // Check if the identifier is not an email (i.e., it's a registration number)
    if (!identifier.includes("@")) {
      // Query Firestore to find the email associated with the regNumber
      const usersCollection = collection(firestore, "users");
      const q = query(usersCollection, where("regNumber", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No user found with that registration number.");
      }

      const user = querySnapshot.docs[0];
      email = user.data().email; // Retrieve the email associated with the regNumber
    }

    // Authenticate with Firebase using the retrieved email or directly with the provided email
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Retrieve custom user data from Firestore
    const userId = userCredential.user.uid;
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User data not found.");
    }

    return {
      user: {
        ...userCredential.user,
        ...userDoc.data(),
      },
    };
  } catch (error: any) {
    console.error("Login failed:", error.message);
    throw new Error(error);
  }
};

export default userLogin;
