import React from "react";
import { useState } from "react";
import { signupError, signupSuccess } from "../utils/util";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate()

  const [data , setData] = useState({
    username: "",
    email: "",
    password:""  
  })

  const handleChange = (e) => {
    const {name , value} = e.target;
    setData({...data , [name]: value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {username , email , password} = data;

    if(!username || !email || !password){
      signupError("All fields are required")
    }

    try{
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/signup`
      console.log("url:" , URL)
      const response = await fetch(URL , {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json();
      console.log(result)

      const { success , error , message} = result;

      if(success){
        signupSuccess(message);
        localStorage.setItem("username" , username)
        setTimeout(() => {
          navigate("/login")
        } , 1000)
      } else if (error){
        signupError(error)
      } else {
        signupError( error || "Server error")
      }

    }catch(err){
      return signupError(err)
    }

  }  


  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-4 py-10">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
            Create Account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="flex flex-col">
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
            </div>

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
                Sign Up
              </button>
              <p className="text-base sm:text-lg mt-3 text-gray-700">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
}

export default Signup;
