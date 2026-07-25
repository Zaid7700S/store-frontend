import React, { useEffect, useState } from "react";
import api from "../Api/api";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Login = () => {

  const { loadUser } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);




  const fetchUser = async () => {
    try {
      const response = await api.get("/api/Users/me");
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetchUser();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/Users/login", {
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      loadUser(); 

      setIsLoggedIn(true);

      await fetchUser();

       navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    loadUser(); 
    setIsLoggedIn(false);
    setUser(null);
    setUsername("");
    setPassword("");
  };

  const handleEdit = () => {
    // Navigate to edit page or open modal
    alert("Navigate to Edit Profile page");
  };

  // Logged-in View
  if (isLoggedIn) {
  return (
    <div className="min-h-[70vh] flex justify-center items-center">
      <div className="border rounded-3xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold">
          Hello {user?.name}
        </h1>

        <div className="flex flex-col gap-4 mt-8">
         <Link to={`/`}><button className="bg-black text-white rounded-full p-3 cursor-pointer w-full" >Back To Home </button></Link>

         
        <Link to={`/edit-details`}><button className="bg-black text-white rounded-full p-3 cursor-pointer w-full" >Edit Details </button></Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white rounded-full p-3 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-[70vh] flex justify-center items-center px-4">
      <div className="w-full max-w-md border mt-4 border-black/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Login</h1>

        <p className="text-black/60 mb-6">
          Enter your username and password.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-black/20 rounded-xl p-3"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black/20 rounded-xl p-3"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-full p-3 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-2 text-black/60">
          Forgot Password{" "}
          <button
            onClick={() => navigate("/reset-password")}
            className="text-black font-semibold underline cursor-pointer"
          >
            Click Here
          </button>
        </p>

          <p className="text-center text-sm mt-4 text-black/60 ">
          Dont have an account?{" "}
          <button

            onClick={() => navigate("/signup")}
            className="text-black font-semibold underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>

        </form>
      </div>
    </div>
  );
};

export default Login;