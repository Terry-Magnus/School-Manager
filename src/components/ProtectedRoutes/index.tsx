import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "../ui/spinner";
import NotFound from "@/pages/error";

type IProtectedRoutesProps = {
  children: React.ReactNode;
  allowedRoles: "admin" | "student";
};

const ProtectedRoutes = ({ children, allowedRoles }: IProtectedRoutesProps) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="absolute h-screen w-screen bg-white flex justify-center items-center">
        <Spinner className="text-[--primary]">Loading...</Spinner>
      </div>
    );
  }

  if (user?.role !== allowedRoles) {
    return (
      <NotFound
        errorCode={401}
        title="Unauthorized"
        message="You are not authorized to visit this page"
      />
    );
  }

  return user ? children : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoutes;
