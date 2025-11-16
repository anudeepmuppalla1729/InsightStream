import { useState } from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const isDesktop = useIsDesktop();

  return (
    <header className="w-full bg-white border-b border-gold-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">

        {/* LEFT — LOGO */}
        <div className="flex items-center space-x-2">
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

        {/* RIGHT — MOBILE SEARCH ICON + PROFILE */}
        {!isDesktop && (
          <div className="flex items-center space-x-4">

            {/* SEARCH ICON */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="text-gray-700 text-lg"
            >
              🔍
            </button>

            {/* PROFILE ICON */}
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </div>
        )}

        {/* RIGHT — DESKTOP PROFILE */}
        {isDesktop && (
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </div>
        )}
      </div>

      {/* MOBILE SEARCH BAR (EXPANDED MODE) */}
      {!isDesktop && mobileSearchOpen && (
        <div className="px-4 py-3 flex items-center space-x-3 border-t border-gray-200 bg-white">

          {/* BACK BUTTON */}
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="text-gray-700 text-lg"
          >
            ←
          </button>

          {/* FULL WIDTH SEARCH INPUT */}
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
    </header>
  );
};

export default Navbar;
