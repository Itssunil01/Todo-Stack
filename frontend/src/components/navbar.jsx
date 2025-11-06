import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // ✅ Check login state dynamically
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkLoginStatus();

    // Listen for login/logout events across tabs
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Handlers
  const handleSignup = () => navigate("/signup");
  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">
        {/* ---------- Left: Logo ---------- */}
        <div
          onClick={() => navigate("/")}
          className="flex-shrink-0 text-2xl font-bold text-blue-600 cursor-pointer"
        >
          MyLogo
        </div>

        {/* ---------- Center: Search Bar ---------- */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ---------- Right Section ---------- */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleSignup}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
              {/* Profile Icon and Username */}
              <div className="flex items-center space-x-2">
                <AccountCircleIcon className="text-gray-700" fontSize="large" />
                <span className="text-gray-800 font-medium">{username.includes("@") ? username.split("@")[0] : username}</span>
              </div>
            </>
          )}
        </div>

        {/* ---------- Mobile Menu Button ---------- */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* ---------- Mobile Dropdown ---------- */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-10">
            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {!isLoggedIn ? (
                <>
                  <button
                    className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={handleSignup}
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                  <div className="flex items-center space-x-2 justify-center py-2">
                    <AccountCircleIcon className="text-gray-700" fontSize="large" />
                    <span className="text-gray-800 font-medium">{username}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
