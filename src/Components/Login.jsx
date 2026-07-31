import React, { useEffect, useState } from "react";
import api from "../Api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Login = () => {
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // If they have a valid token, bounce them to Home immediately
          await api.get("/api/Users/me");
          navigate("/"); 
          return;
        } catch (err) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsInitializing(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username?.trim() || !password?.trim()) {
      setError("Please fill out all fields.");
      return;
    }

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
      navigate("/");
      
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password."
      );
      setLoading(false); 
    } 
  };

  // Show nothing while checking if they are already logged in
  if (isInitializing) {
    return <div className="min-h-[70vh] flex justify-center items-center"></div>;
  }

  return (
    <div className="min-h-[70vh] flex justify-center items-center px-4">
      <div className="w-full max-w-md border mt-4 border-black/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Login</h1>
        <p className="text-black/60 mb-6">Enter your username and password.</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-2">Username or Email</label>
            <input
              type="text"
              placeholder="Enter username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-black/20 rounded-xl p-3"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Password</label>
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
            className="bg-black text-white rounded-full p-3 mt-2 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-2 text-black/60">
            Forgot Password{" "}
            <button
              type="button" 
              onClick={() => navigate("/reset-password")}
              className="text-black font-semibold underline cursor-pointer"
            >
              Click Here
            </button>
          </p>

          <p className="text-center text-sm mt-4 text-black/60">
            Don't have an account?{" "}
            <button
              type="button" 
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
