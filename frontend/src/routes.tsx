import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Detail from "./Pages/Detail";
import Home from "./Pages/Home";

export const router = createBrowserRouter([
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
