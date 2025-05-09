import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Detail from "./pages/Detail";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/detail/:paramId",
        element: <Detail />,
      },
    ],
  },
]);

export default router;
