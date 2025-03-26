import { Package, Search, X } from "lucide-react";
import { useState } from "react";
import { useFolders } from "../context/FolderContext";
export const TopNavbar = ({ setIsMobileMenuOpen, setIsSidebarOpen }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { searchTerm, setSearchTerm } = useFolders(); // Get search states from context

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value); // Update search term in context
  };
  return (
    <header>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 lg:hidden">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-500"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
                <Package className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
              <img
                src="/dash_logo.png"
                alt="SATO studio logo"
                width={120}
                height={40}
                className="mr-2"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center relative">
          {/* <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 mr-2">
            <Search className="h-5 w-5" />
          </button> */}
          {/* <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18 8C18 6.4 17.4 5 16.4 3.9C15.4 2.8 14 2 12.5 2C11 2 9.6 2.8 8.6 3.9C7.6 5 7 6.4 7 8C7 15 3 17 3 17H22C22 17 18 15 18 8Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13.7 21C13.5 21.3 13.3 21.6 13 21.8C12.7 22 12.4 22.1 12 22.1C11.6 22.1 11.3 22 11 21.8C10.7 21.6 10.5 21.3 10.3 21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button> */}
          {isSearchExpanded ? (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-gray-100 rounded-full overflow-hidden pr-2 animate-expand"
              style={{ width: "300px" }}
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border-none outline-none px-4 py-2 text-gray-700 placeholder-gray-500"
                autoFocus
                value={searchTerm} // Bind value to context state
                onChange={handleSearchInputChange}
              />
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 mr-2 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
