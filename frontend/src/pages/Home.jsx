import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import NewsGrid from "../components/NewsGrid";
import { fetchNews } from "../api/news";
import { useReaderStore } from "../store/useReaderStore";
import { useDebounce } from "../hooks/useDebounce";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("General");
  const closeReader = useReaderStore((s) => s.closeReader);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const loaderRef = useRef(null);

  // Show scroll-to-top button when scrolled down
  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    closeReader(); // Always close when feed changes

    setLoading(true);
    setPage(1); // reset page
    setHasMore(true); // reset
    setArticles([]); // wipe old articles

    if (debouncedSearch.trim().length > 0) {
      fetchNews({ q: debouncedSearch, page: 1 }).then((data) => {
        setArticles(data.articles || []);
        setHasMore((data.articles?.length || 0) >= 20);
        setLoading(false);
      });
      return;
    }

    fetchNews({
      country: "us",
      category:
        activeCategory.toLowerCase() === "top stories"
          ? undefined
          : activeCategory.toLowerCase(),
      page: 1,
    }).then((data) => {
      setArticles(data.articles || []);
      setHasMore((data.articles?.length || 0) >= 20);
      setLoading(false);
    });
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Observer checking…", entries[0].isIntersecting);

        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page === 1) return;

    closeReader(); // rule A: reader should close on load more

    if (debouncedSearch.trim().length > 0) {
      fetchNews({ q: debouncedSearch, page }).then((data) => {
        setArticles((prev) => [...prev, ...(data.articles || [])]);
        setHasMore((data.articles?.length || 0) >= 20);
      });
      return;
    }

    fetchNews({
      country: "us",
      category:
        activeCategory.toLowerCase() === "top stories"
          ? undefined
          : activeCategory.toLowerCase(),
      page,
    }).then((data) => {
      setArticles((prev) => [...prev, ...(data.articles || [])]);
      setHasMore((data.articles?.length || 0) >= 20);
    });
  }, [page]);

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <NewsGrid articles={articles} loading={loading} />
      <div ref={loaderRef} className="h-10"></div>

      {/* Scroll to top button */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-gold-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gold-800 transition-colors z-50"
        >
          ↑ Top
        </button>
      )}
    </>
  );
};

export default Home;
