import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextExpander } from "./TextExpander";

export function News({ news, className, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (news.slug || news._id) {
      // Navigate to news detail page
      navigate(`/news/${news.slug || news._id}`);
    }
  };

  return (
    <article
      className={`news-card ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        cursor: onClick || news.slug || news._id ? "pointer" : "default",
      }}
    >
      {/* Image Container with Overlay */}
      <div className="news-image-container">
        {!imageLoaded && (
          <div className="news-image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        <img
          src={news.image}
          alt={news.title || "News image"}
          className={`news-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop";
            setImageLoaded(true);
          }}
        />
        <div className={`news-overlay ${isHovered ? "hovered" : ""}`}></div>
      </div>

      {/* Content */}
      <div className="news-content">
        {news.title && <h3 className="news-title">{news.title}</h3>}

        <div className="news-text">
          <TextExpander
            expandButtonText="Read More +"
            collapseButtonText="Read Less -"
            collapsedNumWords={15}
          >
            {news.content}
          </TextExpander>
        </div>

        {/* Footer with metadata */}
        <div className="news-footer">
          <span className="news-category">
            {news.category || "Sustainability"}
          </span>
          <span className="news-read-time">
            {getReadTime(news.content)} min read
          </span>
        </div>
      </div>
    </article>
  );
}

// Helper function to estimate reading time
function getReadTime(text) {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime || 1;
}
