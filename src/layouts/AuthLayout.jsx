// layouts/AuthLayout.js
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="auth-container bg-[#F7F3F2]">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
