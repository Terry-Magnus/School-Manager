import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "../ui/spinner";

type IProtectedRoutesProps = {
  children: React.ReactNode;
};

const ProtectedRoutes = ({ children }: IProtectedRoutesProps) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="absolute h-screen w-screen bg-white flex justify-center items-center">
        <Spinner className="text-[--primary]">Loading...</Spinner>
        {/* <p className="text-md ">Loading...</p> */}
      </div>
    );
  }

  //   const sessionExpired = () => {
  //     // alert("Your session has expired, please log in again");
  //     // return <Navigate to="/login" state={{ from: location }} />;
  //   };

  return user ? children : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoutes;
