import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from "./components/context/auth";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
