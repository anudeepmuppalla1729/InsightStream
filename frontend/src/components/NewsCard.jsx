import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const NewsCard = ({ article, mode = "default", savedData }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const openReader = useReaderStore((s) => s.openReader);

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);

  const [isRemoving, setIsRemoving] = useState(false);

  // Is this article already saved?
  const isSaved = bookmarks.some((b) => b.article.url === article.url);

  // ---------------------
  // HANDLE CARD CLICK (robust + deterministic)
  // ---------------------
  const handleClick = () => {
    const desktopNow = window.matchMedia("(min-width: 1024px)").matches;

    // DESKTOP -> open ReaderPanel (Home + Saved)
    if (desktopNow) {
      openReader(article);
      return;
    }

    // MOBILE -> full page. encode the id so slashes in URL don't break route
    const safeId = encodeURIComponent(article.url);
    navigate(`/article/${safeId}`, { state: { article } });
  };

  // -------------------------------------------------
  // REMOVE (saved mode)
  // -------------------------------------------------
  const onRemove = async (e) => {
    e.stopPropagation();
    if (!savedData) return;

    setIsRemoving(true);

    setTimeout(async () => {
      await removeBookmark(savedData.id || savedData.article.url, token);
    }, 250);
  };

  // -------------------------------------------------
  // ROOT CLASSES
  // -------------------------------------------------
  const cardRootClasses = `
    rounded-2xl overflow-hidden bg-white border border-gray-200 
    transition-all duration-300
    ${
      mode === "default"
        ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        : "cursor-pointer"
    }
    ${isRemoving ? "opacity-0 scale-95" : ""}
  `;

  return (
    <div className={cardRootClasses} onClick={handleClick}>
      {/* IMAGE */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-xs relative">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt="article"
            className="w-full h-full object-cover"
          />
        ) : (
          "No Image"
        )}

        {/* BOOKMARK BUTTON (default mode) - Moved to image overlay */}
        {mode === "default" && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (isSaved) {
                await removeBookmark(article.url, token);
              } else {
                await addBookmark(article, token);
              }
            }}
            className="
              absolute top-3 right-3 
              text-2xl
              transition-all duration-200
              hover:scale-125
              active:scale-95
              leading-none
              drop-shadow-lg
            "
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              color: isSaved ? "#B7892E" : "#FFFFFF",
            }}
          >
            <span className="block">{isSaved ? "★" : "☆"}</span>
          </button>
        )}

        {/* REMOVE BUTTON (saved page) - Moved to image overlay */}
        {mode === "saved" && (
          <button
            onClick={onRemove}
            className="
              absolute top-3 right-3 
              bg-white/90 backdrop-blur-sm shadow-md 
              w-8 h-8 rounded-full 
              text-sm text-gray-700 
              flex items-center justify-center
              hover:bg-white hover:scale-110
              transition-all duration-200
              active:scale-95
            "
          >
            ✕
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className={`p-5 ${mode === "saved" ? "pt-6" : ""}`}>
        {/* TITLE */}
        <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-snug tracking-tight line-clamp-3">
          {article.title}
        </h3>

        {/* META — default */}
        {mode === "default" && (
          <div className="text-[11px] md:text-xs text-gray-500 mt-3">
            {article.source?.name} · {dayjs(article.publishedAt).fromNow()}
          </div>
        )}

        {/* META — saved */}
        {mode === "saved" && savedData && (
          <div className="text-[12px] md:text-[13px] text-gray-500 mt-3">
            Saved · {dayjs(savedData.savedAt).fromNow()}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
