import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid"; // Import icons
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api"; // Import loginUser API function
const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState(""); // State for general login error message

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginErrorMessage(""); // Clear any previous error messages

    // Client-side validation
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    const userData = { email, password };

    try {
      const response = await loginUser(userData);
      console.log("Login successful:", response);

      // Handle successful login - for now, just alert and clear fields
      // alert('Login Successful!'); // Replace with proper redirection or token handling
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          setLoginErrorMessage(errorData.message); // Set general login error message
        }
      } else if (error.message) {
        // Handle general error message if errors array is not present
        setLoginErrorMessage(`Login failed: ${error.message}`); // Keep alert for unexpected failures for now, can improve later
      } else {
        // Handle other errors (e.g., network errors)
        setLoginErrorMessage("Login failed due to an unexpected error."); // Keep alert for unexpected failures for now, can improve later
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Welcome Section (Left Side - Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 p-12 justify-center items-center text-white">
        <div>
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="Logo" className="mb-4 h-auto w-32" />
          </div>
          <img
            src="/Frame.png"
            alt="Welcome Frame"
            className="mb-4 h-auto w-64 mx-auto"
          />
          <p className="text-3xl font-500 mb-4 mt-8 text-black-custom ">
            Welcome to Sato Studio.
          </p>
          <p className="text-sm text-gray-100 text-black-custom">
            Manage your customer relationships like never before. With real-time
            insights, easy task management, and a dynamic pipeline.
          </p>
        </div>
      </div>

      {/* Login Form Section (Right Side) */}
      <div className="flex-1 flex flex-col justify-center bg-white m-6 rounded-[20px] px-8 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Hi, Welcome
          </h2>
          <p className="text-gray-500 mb-8 text-center">
            Please login to your account
          </p>

          {/* Login Error Message Display */}
          {loginErrorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{loginErrorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                  className={`appearance-none block w-full px-3 py-4 rounded-lg border ${
                    emailError ? "border-red-500" : "border-gray-100"
                  } bg-white placeholder-gray-400 focus:outline-none focus:ring-[#FD5E4F] focus:border-[#FD5E4F] sm:text-sm pl-10`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"} // Toggle input type
                  placeholder="Your password"
                  required
                  className={`appearance-none block w-full px-3 py-4 rounded-lg border ${
                    passwordError ? "border-red-500" : "border-gray-100"
                  } bg-white placeholder-gray-400 focus:outline-none focus:ring-[#FD5E4F] focus:border-[#FD5E4F] sm:text-sm pl-10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {" "}
                  {/* Eye icon toggle */}
                  {passwordVisible ? (
                    <EyeSlashIcon
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeIcon
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label
                  htmlFor="remember-me"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="peer hidden"
                  />
                  <div className="h-5 w-5 border border-gray-300 rounded bg-white flex items-center justify-center peer-checked:bg-[#FD5E4F] peer-checked:border-[#FD5E4F] transition-all duration-200">
                    {/* Conditionally apply 'hidden' class to SVG */}
                    <svg
                      className={`h-4 w-4 text-white ${
                        !passwordVisible ? "peer-checked:block" : "block"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Remember me
                  </span>
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#FD5E4F] hover:text-[#E04C40]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <button
                style={{
                  padding: "1rem",
                  borderRadius: "10px",
                }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer bg-[#FD5E4F] text-white hover:bg-[#e01e0cf2] focus:outline-none focus:ring-2 focus:ring-[#e01e0cf2] focus:ring-opacity-50"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or Sign in with
              </span>
            </div>
          </div>

          <div className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?
            <Link
              to="/signup"
              className="font-medium text-[#FD5E4F] hover:text-[#E04C40] ml-1"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
