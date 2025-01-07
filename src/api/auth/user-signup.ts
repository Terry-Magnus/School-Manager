import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { UserSignup } from "@/types";

export default async function userSignup(formData: UserSignup) {
  const auth = getAuth();

  try {
    //check if user already exists. If they do, send already exists error else continue
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const uid = userCredential.user.uid;

    // Save the registration number and other details in Firestore
    const userRef = doc(firestore, "users", uid);
    await setDoc(userRef, {
      email: formData.email,
      name: formData.name,
      role: formData.role,
      ...(formData.role === "student" && {
        regNumber: formData.regNumber,
        courses: [],
      }),
    });
  } catch (error: any) {
    console.error("Error creating account:", error.message);
    throw new Error(error);
  }
}
