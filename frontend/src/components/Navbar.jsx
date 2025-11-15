import React from "react";

const Navbar = () => {
  return (
    <header className="w-full bg-white border-b border-gold-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">

        {/* Left */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xl tracking-tight">
            InsightStream
          </span>
        </div>

        {/* Middle (empty for now, expands) */}
        <div className="flex-1"></div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
