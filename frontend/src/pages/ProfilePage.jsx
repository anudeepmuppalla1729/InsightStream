import React from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="max-w-md mx-auto px-4 mt-12 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">You’re not logged in</h1>

          <p className="text-gray-600 text-sm mt-2">
            Login to manage your saved articles across devices.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full py-3 bg-gold-700 text-white rounded-xl font-medium"
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto px-4 mt-10">

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow-sm">
            {user.avatar ? (
              <img
                src={`/avatars/${user.avatar}`}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
        </div>

        {/* User Info */}
        <h1 className="text-center text-xl font-semibold text-gray-900">
          {user.name}
        </h1>
        <p className="text-center text-gray-500 text-sm">{user.email}</p>

        {/* Buttons */}
        <div className="mt-10 space-y-3">

          {/* Change Avatar */}
          <button
            onClick={() => navigate("/profile/avatar")}
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 font-medium hover:bg-gray-50 transition"
          >
            Change Avatar
          </button>

          {/* Saved Articles */}
          <button
            onClick={() => navigate("/saved")}
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 font-medium hover:bg-gray-50 transition"
          >
            Saved Articles
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-red-600 font-medium hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
