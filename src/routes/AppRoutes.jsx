// routes/AppRoutes.js
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
// import NotificationLayout from "../layouts/NotificationLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

import VerifyEmail from "../pages/Auth/VerifyEmail";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import FAQPage from "../pages/Profile/FAQPage";
import LanguagePage from "../pages/Profile/LanguagePage";
// import NotificationsPage from "../pages/Profile/NotificationsPage";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResendVerification from "../pages/Auth/ResendVerification";
import ResetPassword from "../pages/Auth/ResetPassword";
import PasswordPage from "../pages/Profile/PasswordPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                </Route> */}

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route element={<PrivateRoute />}>
          {" "}
          {/* Apply PrivateRoute to protect these routes */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            {/* Add other protected routes within AdminLayout here */}
          </Route>
          <Route element={<ProfileLayout />}>
            <Route path="/users" element={<ProfilePage />} />
            <Route path="/info" element={<FAQPage />} />
            <Route path="/settings" element={<LanguagePage />} />
            <Route path="/change-password" element={<PasswordPage />} />
          </Route>
        </Route>

        {/* Dashboard Routes (Requires Auth) */}
        <Route element={<DashboardLayout />}>
          <Route path="/viewer/:documentId" element={<DashboardPage />} />
        </Route>
      </Routes>

      {/* <NotificationProvider>
                <Routes>
                    <Route path="/notifications" element={<NotificationLayout />}>
                        <Route index element={<NotificationsPage />} />
                    </Route>
                </Routes>
            </NotificationProvider> */}
    </Router>
  );
};

export default AppRoutes;
