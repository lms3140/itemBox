import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { useAuthStore } from "../store/zustandStore";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { tokenObj } = useAuthStore();
  return tokenObj ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
