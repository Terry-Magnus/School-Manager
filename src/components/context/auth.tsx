import { User } from "@/types";
import { Children, createContext, useState } from "react";
import { LoadingSpinner } from "../ui/spinner";

interface AuthProviderProps {
  children: React.ReactNode;
}
const AuthContext = createContext(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    <div className="h-screen w-screen flex justify-center items-center">
      <LoadingSpinner className="bg-[#6825bd]" />
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
