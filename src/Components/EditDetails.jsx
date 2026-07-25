import React, { useEffect, useState } from "react";
import api from "../Api/api";
import { useNavigate } from "react-router-dom";

const EditDetails = () => {
  const navigate = useNavigate();

  // Basic Details State
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Feedback State
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Fixed syntax error here

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/Users/me");
      setName(response.data.name);
      // If your API returns the existing profile picture URL, you can set it here:
      if (response.data.profilePictureUrl) setPreviewUrl(response.data.profilePictureUrl);
    } catch (err) {
      navigate("/login");
    }
  };

  // --- Handlers ---

  const handleFileChange = (e) => { // Added the event parameter
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setMessage("");
    setError("");

    // Use FormData to send the file to the backend
    const formData = new FormData();
    formData.append("profileImage", selectedFile); // Matches C# IFormFile parameter name

    try {
      const response = await api.post("/api/Users/upload-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile picture updated successfully!");
      // Optionally update the preview URL with the final Cloudflare R2 URL
      // setPreviewUrl(response.data.profilePictureUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image. Ensure it's under 5MB.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.put("/api/Users/update-user", {
        name,
        password,
      });

      setMessage("Profile details updated successfully.");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-lg border border-black/10 rounded-3xl p-8 shadow-sm">
        
        <h1 className="text-3xl font-bold mb-2">Edit Details</h1>
        <p className="text-black/60 mb-8">Update your profile picture, name, or password.</p>

        {/* Feedback Messages */}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Profile Picture Upload Section */}
        <div className="mb-8 flex flex-col items-center gap-4 border-b border-black/10 pb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border border-black/20 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="text-sm text-black/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 transition cursor-pointer"
            />
            {selectedFile && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={isUploading}
                className="bg-blue-600 text-white rounded-full px-6 py-2 text-sm mt-2 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload Picture"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div>
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black/20 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black/20 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-full p-3 mt-2 hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Details"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="border border-black rounded-full p-3 hover:bg-black hover:text-white transition"
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDetails;