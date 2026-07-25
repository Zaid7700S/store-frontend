import React, { useState } from "react";
import api from "../Api/api";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [resetToken, setResetToken] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setLoadingOtp(true);
    setError("");
    setMessage("");

    try {
      await api.post("/api/Users/forgot-password", {
        userName,
      });

      setOtpSent(true);
      setMessage("OTP has been sent to your registered email.");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoadingVerify(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/api/Users/verify-otp", {
        userName,
        otp,
      });

      setResetToken(res.data.resetToken);
      setOtpVerified(true);
      setMessage("OTP verified successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Invalid OTP.");
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoadingReset(true);

    try {
      await api.post(
        "/api/Users/reset-password",
        {
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      setMessage("Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Password reset failed."
      );
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center px-4">
      <div className="w-full max-w-md border border-black/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>

        <p className="text-black/60 mb-6">
          Enter your username, verify the OTP, and create a new password.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <form
          onSubmit={handleResetPassword}
          className="flex flex-col gap-4"
        >
          {/* Username */}
          <div>
            <label className="block font-medium mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={otpSent}
              className="w-full border border-black/20 rounded-xl p-3"
            />
          </div>

          {/* Send OTP */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!userName || loadingOtp}
              className="bg-black text-white rounded-full p-3 cursor-pointer"
            >
              {loadingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {/* OTP Section */}
          {otpSent && !otpVerified && (
            <>
              <div>
                <label className="block font-medium mb-2">
                  OTP
                </label>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full border border-black/20 rounded-xl p-3 tracking-[8px] text-center text-lg"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || loadingVerify}
                className="bg-blue-600 text-white rounded-full p-3"
              >
                {loadingVerify ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* Password Section */}
          {otpVerified && (
            <>
              <div>
                <label className="block font-medium mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-black/20 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-black/20 rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                disabled={loadingReset}
                className="bg-black text-white rounded-full p-3 cursor-pointer"
              >
                {loadingReset ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="border border-black rounded-full p-3 cursor-pointer"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;