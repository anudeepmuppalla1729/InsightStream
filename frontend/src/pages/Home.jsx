import { useState, useEffect } from "react";
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
  

  useEffect(() => {
    closeReader();
    setLoading(true);

    // If searching → ignore categories
    if (debouncedSearch.trim().length > 0) {
      fetchNews({ q: debouncedSearch }).then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      });
      return;
    }

    // Otherwise → category mode
    fetchNews({
      country: "us",
      category:
        activeCategory.toLowerCase() === "top stories"
          ? undefined
          : activeCategory.toLowerCase(),
    }).then((data) => {
      setArticles(data.articles || []);
      setLoading(false);
    });
  }, [activeCategory, debouncedSearch]);

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <NewsGrid articles={articles} loading={loading} />
    </>
  );
};

export default Home;
