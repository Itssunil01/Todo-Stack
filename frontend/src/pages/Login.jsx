import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { loginError, loginSuccess } from "../utils/util";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    if (!email || !password) {
      return loginError("All Fields Are Required");
    }

    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/login`;

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log(result);

      const { success, error, message, token , user } = result;

      if (success) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username || "");
        window.dispatchEvent(new Event("storage"));

        loginSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (error) {
        loginError(error);
      } else {
        loginError(message || error || "Login Fail");
      }
    } catch (err) {
      return loginError(err);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-4 py-10">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
            Login Account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            {/* <div className="flex flex-col">
              <label className="text-lg sm:text-xl font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="John"
                // required
                className="border border-gray-300 rounded-md p-2 sm:p-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black/50"
                onChange={handleChange}
              />
            </div> */}

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-lg sm:text-xl font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@gmail.com"
                // required
                className="border border-gray-300 rounded-md p-2 sm:p-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black/50"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-lg sm:text-xl font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••"
                // required
                className="border border-gray-300 rounded-md p-2 sm:p-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black/50"
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="h-6 sm:h-12 w-28 sm:w-32 text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-full shadow-md"
              >
                Login
              </button>
              <p className="text-base sm:text-lg mt-3 text-gray-700">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Sign-Up
                </a>
              </p>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Login;
