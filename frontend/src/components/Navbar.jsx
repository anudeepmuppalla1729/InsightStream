import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useAuthStore } from "../store/useAuthStore";
import { LuFolderHeart } from "react-icons/lu";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const goSaved = () => navigate("/saved");
  const goLogin = () => navigate("/login");

  return (
    <header className="w-full bg-white border-b border-gold-700 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        {/* LEFT — LOGO */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <span className="font-semibold text-xl tracking-tight">
            InsightStream
          </span>
        </div>

        {/* MIDDLE — DESKTOP SEARCH BAR */}
        {isDesktop && (
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="
                w-72 px-4 py-2 rounded-full
                border border-gray-200
                bg-white
                focus:ring-2 focus:ring-gold-500 focus:border-gold-500
                transition-all duration-200
              "
            />
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4 relative">
          {/* DESKTOP SAVED ICON */}
          {isDesktop && (
            <button
              onClick={goSaved}
              className="text-gray-700 hover:text-gray-900 transition"
            >
              <LuFolderHeart />
            </button>
          )}

          {/* PROFILE ICON */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                setMenuOpen((p) => !p);
              }}
              className="w-9 h-9 rounded-full overflow-hidden border border-gray-300"
            >
              <img
                src={
                  user?.avatar ? `/avatars/${user.avatar}` : "/pfps/pfp1.png"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* DROPDOWN MENU */}
            {isDesktop && menuOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-44 z-50">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/saved");
                    setMenuOpen(false);
                  }}
                >
                  Saved Articles
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  Profile
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH EXPANDED */}
      {!isDesktop && mobileSearchOpen && (
        <div className="px-4 py-3 flex items-center space-x-3 border-t border-gray-200 bg-white">
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="text-gray-700 text-lg"
          >
            ←
          </button>

          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="
              flex-1 px-4 py-2 rounded-full
              border border-gray-200
              focus:ring-2 focus:ring-gold-500 focus:border-gold-500
              transition-all duration-200
            "
          />
        </div>
      )}

      {/* MOBILE MENU — SHOW ONLY IF USER CLICKS AVATAR */}
      {!isDesktop && user && menuOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-4 z-50 border-t border-gray-200">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>

          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => {
              navigate("/saved");
              setMenuOpen(false);
            }}
          >
            Saved Articles
          </button>

          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
          >
            Profile
          </button>

          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => {
              logout();
              navigate("/login");
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
