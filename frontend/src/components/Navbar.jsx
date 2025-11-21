import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useAuthStore } from "../store/useAuthStore";
import { LuFolderHeart } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const goSaved = () => navigate("/saved");
  const goProfile = () => navigate("/profile");
  const goLogin = () => navigate("/login");

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      // For desktop: Check if click is outside the dropdown menu and profile button
      if (isDesktop) {
        if (!e.target.closest(".profile-dropdown-container")) {
          setMenuOpen(false);
        }
      } else {
        // For mobile: Close if clicking outside the bottom sheet
        const mobileMenu = document.querySelector(".mobile-bottom-menu");
        if (
          mobileMenu &&
          !mobileMenu.contains(e.target) &&
          !e.target.closest(".profile-dropdown-container")
        ) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen, isDesktop]);

  return (
    <header className="w-full bg-white border-b border-gold-700 relative z-40">
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
                focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none
                transition-all duration-200
              "
            />
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4 relative">
          {/* MOBILE SEARCH ICON (moves inside right-side container) */}
          {!isDesktop && (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="text-xl text-gray-700 active:scale-90 transition"
            >
              <IoSearchOutline />
            </button>
          )}

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
          <div className="relative profile-dropdown-container">
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
              <div
                className="
      absolute right-0 top-12 w-40 bg-white border border-gray-200 
      shadow-lg rounded-xl p-2 flex flex-col space-y-1
      animate-fade-slide z-50
    "
              >
                <button
                  onClick={goProfile}
                  className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={goSaved}
                  className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Saved
                </button>

                <button
                  onClick={() => logout()}
                  className="text-left px-3 py-2 rounded-md hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH PANEL — SLIDE DOWN */}
      {!isDesktop && (
        <div
          className={`
      transition-all duration-300 overflow-hidden border-t border-gray-200
      ${mobileSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}
    `}
        >
          <div className="px-4 py-3 flex items-center space-x-3 bg-white">
            {/* Back Button */}
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-xl text-gray-700 active:scale-90 transition"
            >
              ←
            </button>

            {/* Search Input */}
            <input
              type="text"
              autoFocus={mobileSearchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="
          flex-1 px-4 py-2 rounded-full border border-gray-200 
          focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none transition
        "
            />
          </div>
        </div>
      )}

      {/* MOBILE MENU — SHOW ONLY IF USER CLICKS AVATAR */}
      {!isDesktop && user && menuOpen && (
        <div className="mobile-bottom-menu fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-4 z-50 border-t border-gray-200">
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
