import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginLayout from "./layout/LoginLayout";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginLayout />,
    errorElement: <NotFound />,
    children: [{ element: <Login />, index: true }],
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
        index: true,
      },
      {
        path: "/detail/:paramId",
        element: (
          <PrivateRoute>
            <Detail />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
