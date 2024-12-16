import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/error";
import Signup from "./pages/signup";
import StudentResults from "./pages/student-results";
import UploadResults from "./pages/upload-results";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/dashboard";
import AuthLayout from "./components/layout/auth-layout";
import AppLayout from "./components/layout/app-layout";
import Settings from "./pages/settings";
import Courses from "./pages/courses";
import Support from "./pages/support";
import ForgotPassword from "./pages/forgot-password";
import AdminLogin from "./pages/admin-login";
import ResetPassword from "./pages/reset-password";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace={true} />,
    errorElement: <NotFound />,
  },
  {
    element: (
      <AppLayout>
        {/* <AuthProvider> */}
        <ProtectedRoutes />
        {/* </AuthProvider> */}
      </AppLayout>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Login />,
        // errorElement: <NotFound/>
      },
      {
        path: "results",
        element: <StudentResults />,
      },
      {
        path: "upload-result",
        element: <UploadResults />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "support",
        element: <Support />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "login",
        element: <Login />,
        // errorElement: <NotFound/>
      },
      {
        path: "signup",
        element: <Signup />,
        // errorElement: <NotFound/>
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
        // errorElement: <NotFound/>
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
        // errorElement: <NotFound/>
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
        // errorElement: <NotFound/>
      },
    ],
  },
]);

export default routes;
