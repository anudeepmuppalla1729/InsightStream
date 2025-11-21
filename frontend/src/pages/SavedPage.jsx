import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useReaderStore } from "../store/useReaderStore";
import NewsCard from "../components/NewsCard";
import {
  FiFilter,
  FiRepeat,
  FiGrid,
  FiList,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

const DEBOUNCE_MS = 250;

// Animation variants for layout switching
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const SavedPage = () => {
  const navigate = useNavigate();
  const openReader = useReaderStore((s) => s.openReader);

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const loading = useBookmarksStore((s) => s.loading);
  const initForUser = useBookmarksStore((s) => s.initForUser);

  // UI States
  const [view, setView] = useState("grid"); // grid | list
  const [sortBy, setSortBy] = useState("recent"); // recent | oldest | az | za
  const [filterSource, setFilterSource] = useState("all"); // source name or 'all'
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(rawSearch.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [rawSearch]);

  // show scroll-to-top
  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".filter-dropdown")) setShowFilter(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    // Wait until both user and token are ready
    if (user?.id && token) {
      initForUser(user.id, token);
      return;
    }

    // Guest mode (no server sync)
    if (!user?.id) {
      initForUser(null, null);
    }
  }, [user?.id, token]);

  // derived set of valid sources (safe, filtered)
  const sources = useMemo(() => {
    return [
      ...new Set(bookmarks.map((b) => b.article.source?.name).filter(Boolean)),
    ];
  }, [bookmarks]);

  // displayed list with search/filter/sort
  const displayed = useMemo(() => {
    let list = [...bookmarks];

    // search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          (b.article.title || "").toLowerCase().includes(q) ||
          (b.article.description || "").toLowerCase().includes(q)
      );
    }

    // filter by source
    if (filterSource !== "all") {
      list = list.filter((b) => b.article.source?.name === filterSource);
    }

    // sort
    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
    } else if (sortBy === "az") {
      list.sort((a, b) =>
        (a.article.title || "").localeCompare(b.article.title || "")
      );
    } else if (sortBy === "za") {
      list.sort((a, b) =>
        (b.article.title || "").localeCompare(a.article.title || "")
      );
    }

    return list;
  }, [bookmarks, search, filterSource, sortBy]);

  // click handler used for list-row (keeps behavior consistent)
  const handleOpenArticle = (article) => {
    const desktopNow = window.matchMedia("(min-width: 1024px)").matches;
    if (desktopNow) {
      openReader(article);
    } else {
      const safeId = encodeURIComponent(
        article.url || article.title || "article"
      );
      navigate(`/article/${safeId}`, { state: { article } });
    }
  };

  // helper: cycle sort (small UX convenience)
  const cycleSort = () => {
    setSortBy((prev) => {
      if (prev === "recent") return "az";
      if (prev === "az") return "za";
      if (prev === "za") return "oldest";
      return "recent";
    });
  };

  // safe toggle filter: if no sources available do nothing
  const toggleFilter = () => {
    if (sources.length === 0) return;
    setFilterSource((prev) => (prev === "all" ? sources[0] : "all"));
  };

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-screen pb-12">
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                Saved Articles
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Your saved stories across sessions.
              </p>
            </div>

            {/* top-right small meta */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs text-gray-500">Saved</span>
              <span className="font-medium text-gray-900">
                {bookmarks.length}
              </span>
            </div>
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {/* left: search */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-full max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  placeholder="Search saved articles..."
                  value={rawSearch}
                  onChange={(e) => setRawSearch(e.target.value)}
                />
              </div>

              {/* small reset button */}
              <button
                onClick={() => {
                  setRawSearch("");
                  setSearch("");
                  setFilterSource("all");
                  setSortBy("recent");
                }}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                title="Reset filters"
              >
                <FiRepeat />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* right: icons cluster */}
            <div className="flex items-center gap-3">
              {/* sort */}
              <button
                onClick={cycleSort}
                title={`Sort: ${sortBy}`}
                className="p-2 rounded-md hover:bg-gray-50 active:scale-95 transition"
              >
                <FiChevronDown className="text-lg text-gray-700" />
              </button>

              {/* FILTER DROPDOWN */}
              <div className="relative filter-dropdown">
                <button
                  onClick={() => setShowFilter((p) => !p)}
                  className="p-2 rounded-md hover:bg-gray-50 active:scale-95 transition"
                  title="Filter by source"
                >
                  <FiFilter className="text-lg text-gray-700" />
                </button>

                {showFilter && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filterSource === "all"
                          ? "text-gold-700 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        setFilterSource("all");
                        setShowFilter(false);
                      }}
                    >
                      All Sources
                    </button>

                    {sources.map((src) => (
                      <button
                        key={src}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          filterSource === src
                            ? "text-gold-700 font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          setFilterSource(src);
                          setShowFilter(false);
                        }}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* view toggles */}
              <button
                onClick={() => setView("grid")}
                title="Grid view"
                className={`p-2 rounded-md hover:bg-gray-50 active:scale-95 transition ${
                  view === "grid" ? "text-gold-700" : "text-gray-700"
                }`}
              >
                <FiGrid className="text-lg" />
              </button>

              <button
                onClick={() => setView("list")}
                title="List view"
                className={`p-2 rounded-md hover:bg-gray-50 active:scale-95 transition ${
                  view === "list" ? "text-gold-700" : "text-gray-700"
                }`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
          </div>

          {/* content */}
          <section className="mt-6">
            {/* skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden bg-gray-200 h-44"
                  />
                ))}
              </div>
            )}

            {/* empty state */}
            {!loading && displayed.length === 0 && (
              <div className="mt-20 text-center text-gray-500">
                <div className="text-5xl mb-4">📁</div>
                <h2 className="text-xl font-medium text-gray-800">
                  No Saved Articles
                </h2>
                <p className="text-gray-500 mt-1">
                  Bookmark news stories and they’ll appear here.
                </p>
              </div>
            )}

            {/* grid */}
            <AnimatePresence mode="wait">
              {!loading && displayed.length > 0 && view === "grid" && (
                <motion.div
                  key="grid-view"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {displayed.map((item) => (
                    <motion.div
                      key={item.id || item.article.url}
                      variants={itemVariants}
                      layout
                    >
                      <NewsCard
                        article={item.article}
                        mode="saved"
                        savedData={item}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* list */}
            <AnimatePresence mode="wait">
              {!loading && displayed.length > 0 && view === "list" && (
                <motion.div
                  key="list-view"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  {displayed.map((item) => (
                    <motion.div
                      key={item.id || item.article.url}
                      variants={itemVariants}
                      layout
                      className="flex gap-4 border border-gray-200 rounded-xl p-4 hover:shadow transition cursor-pointer"
                      onClick={() => handleOpenArticle(item.article)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="w-36 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.article.urlToImage ? (
                          <img
                            src={item.article.urlToImage}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
                          {item.article.title}
                        </h3>
                        <div className="mt-2 text-xs text-gray-500">
                          {item.article.source?.name || "Unknown Source"} •{" "}
                          {new Date(item.savedAt).toLocaleDateString()}
                        </div>
                        <p className="mt-3 text-gray-700 text-sm line-clamp-3">
                          {item.article.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* scroll to top */}
          {showScroll && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 bg-gold-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gold-800 transition-colors"
            >
              ↑ Top
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default SavedPage;
