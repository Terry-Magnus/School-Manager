import { createContext, useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/lib/firebaseConfig"; // Replace with your Firebase configuration path
import { doc, getDoc } from "firebase/firestore";
import { CustomUser } from "@/types";

interface AuthContextProps {
  user: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUser({
          ...currentUser,
          ...userDoc.data(),
        } as CustomUser);
      } else {
        setUser(currentUser as CustomUser);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const refreshUser = useCallback(() => fetchUser(), [fetchUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, refreshUser);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
