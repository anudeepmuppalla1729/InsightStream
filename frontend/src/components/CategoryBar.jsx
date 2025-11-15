import { useState } from "react";

const categories = [
  "Top Stories",
  "World",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
];

const CategoryBar = () => {
  const [active, setActive] = useState("Top Stories");

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">

        {/* Scrollable Row */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide h-12 items-center">

          {categories.map((cat) => {
            const isActive = active === cat;

            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={
                  isActive
                    ? "px-4 py-1.5 bg-gold-600 text-white font-medium rounded-full transition-all duration-200 ease-out active:scale-[0.97] whitespace-nowrap"
                    : "text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
                }
              >
                {cat}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
