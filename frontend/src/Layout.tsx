import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Layout;
