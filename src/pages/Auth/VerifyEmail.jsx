import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../../services/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("loading"); // "loading", "verified", "expired"

  // useEffect(() => {
  //   const checkEmailVerification = async () => {
  //     const result = await verifyEmail(token);

  //     if (result.success) {
  //       setEmail(result.email);
  //       setStatus("verified");
  //     } else {
  //       setStatus("expired");
  //     }
  //   };

  //   checkEmailVerification();
  // }, [token]);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        if (!isMounted) return;

        if (result.success) {
          setEmail(result.email);
          setStatus("verified");
        } else {
          setStatus("expired");
        }
      } catch (error) {
        if (isMounted) setStatus("expired");
      }
    };

    verify();

    return () => {
      isMounted = false; // Cleanup to avoid memory leaks
    };
  }, [token]);

  return (
    <div className="min-h-screen flex">
      {/* Login Form Section */}
      <div className="flex-1 flex flex-col justify-center bg-white m-6 rounded-[20px] px-8 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Hi, Welcome
          </h2>

          {status === "loading" ? (
            <p className="text-gray-500 text-center">Verifying your email...</p>
          ) : status === "verified" ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900">
                Email Verified
              </h3>
              <p className="mt-1 text-gray-500">
                Your email {email} has been successfully verified.
              </p>
              <button
                style={{
                  backgroundColor: "#FD5E4F",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "10px",
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                onClick={() => navigate("/login")}
              >
                Go to Login Page
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-red-600">
                Verification Failed
              </h3>
              <p className="mt-1 text-gray-500">
                Your verification token has expired.
              </p>
              <button
                style={{
                  backgroundColor: "#FD5E4F",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "10px",
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                onClick={() => navigate("/resend-verification")}
              >
                Resend Verification Email
              </button>
            </>
          )}

          <div className="flex justify-center md:justify-start mt-4">
            <button
              className="flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login Screen
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default VerifyEmail;
