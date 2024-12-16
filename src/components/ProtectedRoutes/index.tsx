import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

// interface IProtectedRoutesProps {}

const ProtectedRoutes = () => {
  const isLoggedin: boolean = true;
  const location = useLocation();

  return isLoggedin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoutes;
