import { useState } from "react";
import api from "../Api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  // 1. ADDED EMAIL TO STATE
  const [formData, setFormData] = useState({
    username: "",
    email: "", 
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSignup = async (e) => {
  e.preventDefault();

  // ==========================================
  // 1. ADD THIS VALIDATION SHIELD
  // ==========================================
  if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
    setError("Please fill out all fields before submitting.");
    return; // Stops the function from hitting the API
  }

  setLoading(true);
  setError("");

  try {
    await api.post("/api/Users/SignUp", formData);
    navigate("/login");
  } catch (err) {
    setError(
      err.response?.data?.message || "Signup failed. Try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[70vh] flex justify-center items-center px-4">
      <div className="w-full max-w-md border border-black/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-black/60 mb-6">Enter your details to create an account.</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-black/20 rounded-xl p-3"
              disabled={loading}
              required
            />
          </div>

          {/* 2. ADDED EMAIL INPUT FIELD */}
          <div>
            <label className="block font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-black/20 rounded-xl p-3"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-black/20 rounded-xl p-3"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-full p-3 mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-black/60">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-black font-semibold underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
