import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Detail from "./Pages/Detail.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/detail/:paramId",
    element: <Detail />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
