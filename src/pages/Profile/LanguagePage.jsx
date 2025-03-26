import { ChevronDown, Languages } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("German");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "en", name: "English", flag: "🇬🇧" },
    // { code: "fr", name: "French", flag: "🇫🇷" },
    // { code: "es", name: "Spanish", flag: "🇪🇸" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-xl">✱</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>

        <nav className="mt-4">
          <Link
            to="/settings"
            className={`w-full flex items-center px-6 py-3 space-x-3 border-l-4 border-[#FD5E4F] bg-coral-100 `}
          >
            <Languages className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Language</span>
          </Link>

          {/* <Link to="/change-password" className={`w-full flex items-center px-6 py-3 space-x-3 border-l-4 border-transparent hover:bg-gray-50`}
                    >
                        <Lock className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Password</span>
                    </Link> */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Language</h2>
          <p className="text-gray-500 mb-6">
            Select your Favorite Language and enjoy it.
          </p>

          {/* Language Selector */}
          <div className="max-w-xl relative">
            <button
              className="w-full px-4 py-3 bg-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-200 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {
                    languages.find((lang) => lang.name === selectedLanguage)
                      ?.flag
                  }
                </span>
                <span className="text-gray-700">{selectedLanguage}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg py-2 z-10">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    onClick={() => {
                      setSelectedLanguage(language.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="text-2xl">{language.flag}</span>
                    <span className="text-gray-700">{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguagePage;
