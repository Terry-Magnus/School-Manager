import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from "./components/context/auth";
import ErrorBoundary from "./components/ProtectedRoutes/error-boundary";

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={routes} />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
