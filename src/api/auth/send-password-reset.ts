import { UserSignup } from "@/types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default async function sendPasswordResetMail({
  email,
}: Pick<UserSignup, "email">) {
  const auth = getAuth();

  await sendPasswordResetEmail(auth, email)
    .then(() => {
      return;
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error.message);
      throw new Error(error);
    });
}
