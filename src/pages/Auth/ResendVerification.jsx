// src/components/ResendVerificationForm.js
import { Mail } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { ResendVerificationForm } from "../../services/api";

const ResendVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = React.useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await ResendVerificationForm(data.email);
      setMessage({
        text: response.message || "Verification email sent successfully!",
        type: "success", // Check the success flag
      });
    } catch (error) {
      setMessage({
        text: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Mail className="w-8 h-8 text-red-500" />
          <span className="text-2xl font-bold">Sato Studio</span>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              Hi, Welcome
            </h2>
            <p className="mt-2 text-gray-600">
              Please enter your email address
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Your email"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Sending..." : "Send Verification Email"}
            </button>
          </form>

          {message.text && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
