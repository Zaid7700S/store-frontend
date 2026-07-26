import React, { useEffect, useState } from "react";
import api from "../Api/api";
import { useNavigate, Link } from "react-router-dom";

const Details = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "", // 1. ADDED EMAIL TO STATE
        profilePictureUrl: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get("/api/Users/me");
            setUser({
                name: response.data.name,
                username: response.data.userName,
                email: response.data.email, // 2. PULL EMAIL FROM API
                profilePictureUrl: response.data.profilePictureUrl,
            });
        } catch (err) {
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken"); 
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex justify-center items-center px-4 py-10">
            <div className="w-full max-w-md border border-black/10 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border border-black/20 bg-gray-200 flex items-center justify-center">
                        <img
                            src={
                                user.profilePictureUrl?.trim()
                                    ? user.profilePictureUrl
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        user.name || "User"
                                    )}&background=000000&color=ffffff&size=256`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user.name || "User"
                                )}&background=000000&color=ffffff&size=256`;
                            }}
                        />
                    </div>
                    <h2 className="text-2xl font-bold mt-5">{user.name}</h2>
                    <p className="text-gray-500">@{user.username}</p>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="border rounded-xl p-4">
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-semibold">{user.name}</p>
                    </div>

                    <div className="border rounded-xl p-4">
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-semibold">{user.username}</p>
                    </div>

                    {/* 3. ADDED EMAIL DISPLAY BOX */}
                    <div className="border rounded-xl p-4">
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold">{user.email || "No email provided"}</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/edit-details")}
                        className="bg-black text-white rounded-full py-3 cursor-pointer hover:bg-neutral-800 transition"
                    >
                        Edit Details
                    </button>
                     <Link to={`/`}><button
                        className="bg-black text-white rounded-full py-3 cursor-pointer w-full hover:bg-neutral-800 transition"
                    >
                        Back to Home
                    </button></Link>
                    <button
                        onClick={handleLogout}
                        className="border border-red-500 text-red-500 rounded-full py-3 cursor-pointer hover:bg-red-500 hover:text-white transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Details;
