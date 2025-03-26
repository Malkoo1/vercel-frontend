import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = sessionStorage.getItem("accessToken");
    const expiry = sessionStorage.getItem("tokenExpiry");

    // Check if token exists and is still valid
    if (!token || !expiry || Date.now() > Number(expiry)) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("tokenExpiry");
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
