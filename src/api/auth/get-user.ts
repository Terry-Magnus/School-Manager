import { firestore } from "@/lib/firebaseConfig";
import { CustomUser } from "@/types";
import { USERROLESENUM } from "@/types/enums";
import { collection, getDocs, query, where } from "firebase/firestore";

interface searchUserProps {
  searchTerm: string;
  param: string;
  role: USERROLESENUM.ADMIN | USERROLESENUM.STUDENT;
}
export default async function searchUser({
  param, // fields in firebase e.g regNumber, name, email
  searchTerm,
  role,
}: searchUserProps) {
  try {
    const usersCollection = collection(firestore, "users");
    const q = query(
      usersCollection,
      where("role", "==", role),
      where(param, "==", searchTerm)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Get the first (and only) document
      const result = { uid: doc.id, ...doc.data() };
      return result as CustomUser;
    } else {
      throw new Error("No students found with this registration number.");
    }
  } catch (err) {
    console.error("An error occurred while searching.");
    throw new Error("An error occurred while searching.");
  }
}
