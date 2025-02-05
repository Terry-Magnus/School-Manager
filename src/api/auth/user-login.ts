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

// const userLogin = async (identifier: string, password: string) => {
//   const auth = getAuth();

//   try {
//     let email = identifier;

//     // Check if the identifier is not an email (i.e., it's a registration number)
//     if (!identifier.includes("@")) {
//       // Query Firestore to find the email associated with the regNumber
//       const usersCollection = collection(firestore, "users");
//       const q = query(usersCollection, where("regNumber", "==", identifier));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         throw new Error("No user found with that registration number.");
//       }

//       const user = querySnapshot.docs[0];
//       email = user.data().email; // Retrieve the email associated with the regNumber
//     }

//     // Authenticate with Firebase using the retrieved email or directly with the provided email
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     // Retrieve custom user data from Firestore
//     const userId = userCredential.user.uid;
//     const userDocRef = doc(firestore, "users", userId);
//     const userDoc = await getDoc(userDocRef);

//     if (!userDoc.exists()) {
//       throw new Error("User data not found.");
//     }

//     return {
//       user: {
//         ...userCredential.user,
//         ...userDoc.data(),
//       },
//     };
//   } catch (error: any) {
//     console.error("Login failed:", error.message);
//     throw new Error(error);
//   }
// };

// export default userLogin;

const userLogin = async (
  identifier: string,
  password: string,
  allowedRole: string
) => {
  const auth = getAuth();

  try {
    let email = identifier;
    let userRole;
    let userId;

    const usersCollection = collection(firestore, "users");

    // Check if the identifier is a registration number (not an email)
    if (!identifier.includes("@")) {
      // Query Firestore to find the user by regNumber
      const q = query(
        usersCollection,
        where("regNumber", "==", identifier),
        where("role", "==", "student")
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No user found with that registration number.");
      }

      const userDoc = querySnapshot.docs[0];
      email = userDoc.data().email; // Retrieve the associated email
      userRole = userDoc.data().role; // Get the role
      userId = userDoc.id; // Store the user ID
    } else {
      // if the identifier is an email
      const q = query(
        usersCollection,
        where("email", "==", identifier),
        where("role", "==", "admin")
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No user found with that email.");
      }

      const userDoc = querySnapshot.docs[0];
      userRole = userDoc.data().role; // Get the role
      userId = userDoc.id; // Store the user ID
    }

    // Check if the user has the correct role
    if (userRole !== allowedRole) {
      throw new Error("Access denied: Unauthorized role.");
    }

    // Authenticate with Firebase using the retrieved email
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Retrieve custom user data from Firestore
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
    throw new Error(error.message);
  }
};

export default userLogin;
